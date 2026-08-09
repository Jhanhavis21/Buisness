import type { Request, Response, NextFunction } from 'express';
import { ChatService } from '../services/chat.service.js';
import { sendSuccess } from '../utils/response.js';

export class ChatController {
  private readonly chatService = new ChatService();

  public sendMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { message } = req.body;
      const data = await this.chatService.sendMessage(message);
      sendSuccess(res, data, 'Chat response returned');
    } catch (error) {
      next(error);
    }
  };
}
