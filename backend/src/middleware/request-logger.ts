import type { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';

export const requestLogger = (req: Request, _res: Response, next: NextFunction): void => {
  logger.info('Incoming request', {
    method: req.method,
    path: req.originalUrl,
    ip: req.ip
  });
  next();
};
