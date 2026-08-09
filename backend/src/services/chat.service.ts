import { OpenAiService } from './openai.service.js';
import { AppError } from '../errors/app-error.js';

export class ChatService {
  private readonly openAiService = new OpenAiService();

  public async sendMessage(message?: string): Promise<{ input?: string; reply: string }> {
    const sanitized = typeof message === 'string' && message.trim().length > 0 ? message.trim() : '';

    if (!sanitized) {
      throw new AppError('Message is required.', 400);
    }

    const reply = await this.openAiService.createChatCompletion(sanitized);

    return {
      input: sanitized,
      reply
    };
  }
}
