import type { Request, Response, NextFunction } from 'express';
import { HealthService } from '../services/health.service.js';
import { MondayService } from '../services/monday.service.js';
import { sendSuccess } from '../utils/response.js';

export class StatusController {
  constructor(
    private readonly healthService = new HealthService(),
    private readonly mondayService = new MondayService({
      apiToken: process.env.MONDAY_API_TOKEN || '',
      apiUrl: process.env.MONDAY_API_URL || 'https://api.monday.com/v2',
      dealBoardId: process.env.DEAL_FUNNEL_BOARD_ID,
      workOrderBoardId: process.env.WORK_ORDER_TRACKER_BOARD_ID
    })
  ) {}

  public getStatus = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const health = this.healthService.getHealth();
      const monday = await this.mondayService.getStatus();
      sendSuccess(res, { health, monday, lastSyncedAt: new Date().toISOString() }, 'System status retrieved');
    } catch (error) {
      next(error);
    }
  };
}
