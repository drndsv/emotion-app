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
import { GIGACHAT_CA_CERTIFICATE } from '../constants/gigachat-certificate';
import { Agent } from 'node:https';
import axios from 'axios';

const gigachatHttpsAgent = new Agent({
  ca: GIGACHAT_CA_CERTIFICATE,
});

export async function analyzeEmotionWithGigaChat(
  text: string,
): Promise<EmotionAnalysisResult> {
  const accessToken = await getAccessToken();

  const response = await axios.post<GigaChatResponse>(
    GIGACHAT_COMPLETIONS_URL,
    {
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
    },
    {
      httpsAgent: gigachatHttpsAgent,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    },
  );

  const content = response.data.choices?.[0]?.message?.content ?? '';

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
  try {
    const response = await axios.post<GigaChatTokenResponse>(
      GIGACHAT_OAUTH_URL,
      new URLSearchParams({
        scope: GIGACHAT_SCOPE,
      }),
      {
        httpsAgent: gigachatHttpsAgent,
        headers: {
          Authorization: `Basic ${GIGACHAT_AUTH_KEY}`,
          RqUID: crypto.randomUUID(),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    return response.data.access_token;
  } catch (error) {
    console.error(error);

    throw new Error(GIGACHAT_MESSAGES.tokenRequestFailed);
  }
}
