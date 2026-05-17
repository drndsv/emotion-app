package com.emotiondiary.service;

import com.emotiondiary.dto.Dto.EmotionAnalysisResult;
import com.emotiondiary.exception.ApiException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class EmotionService {
  private static final Set<String> ALLOWED =
      Set.of("joy", "sadness", "anxiety", "anger", "calm", "neutral");

  private final RestClient restClient = RestClient.builder().build();
  private final ObjectMapper objectMapper = new ObjectMapper();

  @Value("${app.gigachat.auth-url}")
  String authUrl;

  @Value("${app.gigachat.api-url}")
  String apiUrl;

  @Value("${app.gigachat.credentials:}")
  String credentials;

  @Value("${app.gigachat.scope:GIGACHAT_API_PERS}")
  String scope;

  public EmotionAnalysisResult analyze(String text) {
    if (credentials == null || credentials.isBlank()) {
      throw new ApiException("GigaChat credentials are not configured. Set GIGACHAT_CREDENTIALS.");
    }
    try {
      String accessToken = fetchAccessToken();
      String content = callGigaChat(accessToken, text);
      JsonNode json = extractJson(content);

      String detected = normalizeEmotion(json.path("detectedEmotion").asText("neutral"));
      String analysis = json.path("analysis").asText("").trim();
      String recommendation = json.path("recommendation").asText("").trim();

      if (analysis.isBlank() || recommendation.isBlank()) {
        throw new ApiException("GigaChat returned incomplete response.");
      }

      return new EmotionAnalysisResult(detected, analysis, recommendation);
    } catch (ApiException ex) {
      throw ex;
    } catch (Exception ex) {
      throw new ApiException("Failed to analyze emotion via GigaChat: " + ex.getMessage());
    }
  }

  private String fetchAccessToken() throws Exception {
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
            "model", "GigaChat",
            "temperature", 0.2,
            "messages",
                List.of(
                    Map.of(
                        "role", "system",
                        "content",
                            "Ты анализируешь эмоции. Верни ТОЛЬКО JSON без markdown: {\"detectedEmotion\":\"joy|sadness|anxiety|anger|calm|neutral\",\"analysis\":\"...\",\"recommendation\":\"...\"}"),
                    Map.of("role", "user", "content", text)));

    JsonNode response =
        restClient
            .post()
            .uri(apiUrl)
            .contentType(MediaType.APPLICATION_JSON)
            .header("Authorization", "Bearer " + token)
            .body(payload)
            .retrieve()
            .body(JsonNode.class);

    return response.path("choices").path(0).path("message").path("content").asText("");
  }

  private JsonNode extractJson(String content) throws Exception {
    String trimmed = content.trim();
    int start = trimmed.indexOf('{');
    int end = trimmed.lastIndexOf('}');
    if (start < 0 || end <= start) {
      throw new ApiException("GigaChat response is not a valid JSON object.");
    }
    return objectMapper.readTree(trimmed.substring(start, end + 1));
  }

  private String normalizeEmotion(String raw) {
    String value = raw == null ? "neutral" : raw.trim().toLowerCase();
    return ALLOWED.contains(value) ? value : "neutral";
  }
}
