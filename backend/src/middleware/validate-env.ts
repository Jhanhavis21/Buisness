import type { Request, Response, NextFunction } from 'express';
import { config } from '../config/environment.js';
import { AppError } from '../errors/app-error.js';

export const validateEnv = (_req: Request, _res: Response, next: NextFunction): void => {
  try {
    if (!config) {
      throw new AppError('Configuration is missing', 500);
    }
    next();
  } catch (error) {
    next(error);
  }
};
