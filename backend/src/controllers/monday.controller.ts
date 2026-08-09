import type { NextFunction, Request, Response } from 'express';
import { MondayService } from '../services/monday.service.js';
import { sendSuccess } from '../utils/response.js';

export class MondayController {
  constructor(private readonly mondayService: MondayService) {}

  public getStatus = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.mondayService.getStatus();
      sendSuccess(res, data, 'Monday integration status retrieved');
    } catch (error) {
      next(error);
    }
  };

  public getDeals = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.mondayService.getDeals();
      sendSuccess(res, data, 'Deals retrieved from Monday');
    } catch (error) {
      next(error);
    }
  };

  public getWorkOrders = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.mondayService.getWorkOrders();
      sendSuccess(res, data, 'Work orders retrieved from Monday');
    } catch (error) {
      next(error);
    }
  };
}
