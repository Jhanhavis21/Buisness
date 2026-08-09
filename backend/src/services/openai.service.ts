import { GoogleGenAI } from '@google/genai';
import { AppError } from '../errors/app-error.js';
import { config } from '../config/environment.js';
import { logger } from '../utils/logger.js';

export class OpenAiService {
  private readonly ai: GoogleGenAI;

  constructor() {
    if (!config.geminiApiKey) {
      throw new AppError(
        'AI integration is not configured. Set GEMINI_API_KEY in the environment.',
        500
      );
    }

    this.ai = new GoogleGenAI({
      apiKey: config.geminiApiKey,
    });
  }

  public async createChatCompletion(prompt: string): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `You are a helpful business intelligence assistant.

User Question:
${prompt}`,
              },
            ],
          },
        ],
      });

      const reply = response.text;

      if (!reply) {
        throw new AppError('Gemini returned an empty response.', 502);
      }

      return reply.trim();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown Gemini error';
      const statusCode = typeof (error as { status?: number })?.status === 'number'
        ? (error as { status: number }).status
        : undefined;
      const quotaExceeded = /429|RESOURCE_EXHAUSTED|quota|limit:\s*0/i.test(message);
      const invalidKey = /API key not valid|API_KEY_INVALID|INVALID_ARGUMENT/i.test(message);

      logger.error('Gemini request failed', {
        statusCode,
        message,
        quotaExceeded,
        invalidKey
      });

      if (quotaExceeded || statusCode === 429) {
        throw new AppError(
          'AI service is temporarily unavailable because the configured Gemini API quota has been exceeded. Please try again later.',
          429,
          true,
          { provider: 'Gemini', statusCode, message }
        );
      }

      if (invalidKey) {
        throw new AppError(
          'AI service is temporarily unavailable because the configured Gemini API key is invalid or unavailable. Please check the backend configuration and try again later.',
          500,
          true,
          { provider: 'Gemini', statusCode, message }
        );
      }

      throw new AppError('Gemini request failed', 502, true, {
        provider: 'Gemini',
        statusCode,
        message
      });
    }
  }
}