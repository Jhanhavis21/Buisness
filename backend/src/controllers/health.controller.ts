import type { Request, Response, NextFunction } from 'express';
import { HealthService } from '../services/health.service.js';
import { sendSuccess } from '../utils/response.js';

export class HealthController {
  constructor(private readonly healthService: HealthService = new HealthService()) {}

  public getHealth = (_req: Request, res: Response, next: NextFunction): void => {
    try {
      const data = this.healthService.getHealth();
      sendSuccess(res, data, 'Backend is healthy');
    } catch (error) {
      next(error);
    }
  };
}
