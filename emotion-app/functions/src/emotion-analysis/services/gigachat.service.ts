import {
  DEFAULT_ANALYSIS,
  DEFAULT_RECOMMENDATION,
} from '../constants/emotion-states';
import {
  GIGACHAT_AUTH_KEY,
  GIGACHAT_COMPLETIONS_URL,
  GIGACHAT_CONTENT_LOG_PREFIX,
  GIGACHAT_MESSAGES,
  GIGACHAT_MODEL,
  GIGACHAT_OAUTH_URL,
  GIGACHAT_SCOPE,
  GIGACHAT_SYSTEM_PROMPT,
  GIGACHAT_TEMPERATURE,
} from '../constants/gigachat';
import {
  EmotionAnalysisResult,
  GigaChatEmotionJson,
} from '../models/emotion-analysis-result.model';
import {
  GigaChatResponse,
  GigaChatTokenResponse,
} from '../models/gigachat.model';
import { createEmotionAnalysisPrompt } from '../prompts/emotion-analysis.prompt';
import { isEmotionState, normalizeEmotion } from '../utils/emotion-normalizer';

export async function analyzeEmotionWithGigaChat(
  text: string,
): Promise<EmotionAnalysisResult> {
  const accessToken = await getAccessToken();

  const response = await fetch(GIGACHAT_COMPLETIONS_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: GIGACHAT_MODEL,
      temperature: GIGACHAT_TEMPERATURE,
      messages: [
        {
          role: 'system',
          content: GIGACHAT_SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: createEmotionAnalysisPrompt(text),
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(GIGACHAT_MESSAGES.requestFailed);
  }

  const data = (await response.json()) as GigaChatResponse;
  const content = data.choices?.[0]?.message?.content ?? '';

  console.log(GIGACHAT_CONTENT_LOG_PREFIX, content);

  const parsed = JSON.parse(content) as GigaChatEmotionJson;
  const emotion = String(parsed.emotion ?? '')
    .trim()
    .toLowerCase();

  return {
    detectedState: isEmotionState(emotion)
      ? emotion
      : normalizeEmotion(emotion),
    analysis: parsed.analysis ?? DEFAULT_ANALYSIS,
    recommendation: parsed.recommendation ?? DEFAULT_RECOMMENDATION,
  };
}

async function getAccessToken(): Promise<string> {
  const response = await fetch(GIGACHAT_OAUTH_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${GIGACHAT_AUTH_KEY}`,
      RqUID: crypto.randomUUID(),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      scope: GIGACHAT_SCOPE,
    }),
  });

  if (!response.ok) {
    throw new Error(GIGACHAT_MESSAGES.tokenRequestFailed);
  }

  const data = (await response.json()) as GigaChatTokenResponse;

  return data.access_token;
}
