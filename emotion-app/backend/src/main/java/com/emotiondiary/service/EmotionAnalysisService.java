package com.emotiondiary.service;

import com.emotiondiary.dto.Dto.EmotionAnalysisResult;
import com.emotiondiary.exception.ApiException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
@RequiredArgsConstructor
public class EmotionAnalysisService {

  private final EmotionService emotionService;
  private final RestClient restClient = RestClient.builder().build();
  private final ObjectMapper objectMapper = new ObjectMapper();

  private static final String EMOTION_ANALYSIS_PROMPT = """
Проанализируй эмоциональное состояние человека по тексту.

Выбери ТОЛЬКО ОДНО итоговое состояние из списка:

- joy — радость, воодушевление, удовольствие, позитив
- calm — спокойствие, расслабленность, устойчивое состояние
- neutral — нейтральное состояние, без ярко выраженной эмоции
- anxiety — тревога, напряжение, страх, беспокойство, нервозность
- anger — злость, раздражение, агрессия, фрустрация
- sadness — грусть, усталость, подавленность, печаль

Даже если эмоций несколько, выбери наиболее выраженное итоговое эмоциональное состояние.

Если в тексте сначала описаны позитивные события, но в конце человек чувствует себя плохо — ориентируйся именно на итоговое состояние человека.

Верни ответ СТРОГО в JSON формате.
Не используй markdown.
Не добавляй пояснения до или после JSON.

Формат ответа:

{
  "detectedEmotion": "joy | calm | neutral | anxiety | anger | sadness",
  "analysis": "краткий анализ на русском языке в 1-2 предложениях",
  "recommendation": "краткая рекомендация на русском языке в 1-2 предложениях"
}

В поле detectedEmotion верни только одно из значений:

joy
calm
neutral
anxiety
anger
sadness

Рекомендация должна быть поддерживающей и безопасной.
Не ставь диагнозы.
Не используй медицинские заключения.
""";

  @Value("${app.gigachat.auth-url}")
  private String authUrl;

  @Value("${app.gigachat.api-url}")
  private String apiUrl;

  @Value("${app.gigachat.credentials:}")
  private String credentials;

  @Value("${app.gigachat.scope:GIGACHAT_API_PERS}")
  private String scope;

  public EmotionAnalysisResult analyze(String text) {
    if (credentials == null || credentials.isBlank()) {
      throw new ApiException("GigaChat credentials are not configured. Set GIGACHAT_CREDENTIALS.");
    }

    try {
      String accessToken = fetchAccessToken();
      String content = callGigaChat(accessToken, text);
      JsonNode json = extractJson(content);

      String detectedEmotion =
          emotionService.normalizeName(json.path("detectedEmotion").asText("neutral"));
      String analysis = json.path("analysis").asText("").trim();
      String recommendation = json.path("recommendation").asText("").trim();

      if (analysis.isBlank() || recommendation.isBlank()) {
        throw new ApiException("GigaChat returned incomplete response.");
      }

      return new EmotionAnalysisResult(detectedEmotion, analysis, recommendation);
    } catch (ApiException ex) {
      throw ex;
    } catch (Exception ex) {
      throw new ApiException("Failed to analyze emotion via GigaChat: " + ex.getMessage());
    }
  }

  private String fetchAccessToken() {
    JsonNode tokenResponse =
        restClient
            .post()
            .uri(authUrl)
            .contentType(MediaType.APPLICATION_FORM_URLENCODED)
            .header("Authorization", "Basic " + credentials)
            .header("RqUID", UUID.randomUUID().toString())
            .body("scope=" + scope)
            .retrieve()
            .body(JsonNode.class);

    String token = tokenResponse == null ? "" : tokenResponse.path("access_token").asText("");
    if (token.isBlank()) {
      throw new ApiException("Unable to get GigaChat access token.");
    }
    return token;
  }

  private String callGigaChat(String token, String text) {
    Map<String, Object> payload =
      Map.of(
        "model",
        "GigaChat",
        "temperature",
        0.2,
        "messages",
        List.of(
          Map.of(
            "role",
            "system",
            "content",
            EMOTION_ANALYSIS_PROMPT),
          Map.of(
            "role",
            "user",
            "content",
            text)));

    JsonNode response =
      restClient
        .post()
        .uri(apiUrl)
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", "Bearer " + token)
        .body(payload)
        .retrieve()
        .body(JsonNode.class);

    return response == null
      ? ""
      : response.path("choices").path(0).path("message").path("content").asText("");
  }

  private JsonNode extractJson(String content) throws Exception {
    String trimmed = content == null ? "" : content.trim();
    int start = trimmed.indexOf('{');
    int end = trimmed.lastIndexOf('}');
    if (start < 0 || end <= start) {
      throw new ApiException("GigaChat response is not a valid JSON object.");
    }
    return objectMapper.readTree(trimmed.substring(start, end + 1));
  }
}
