import type { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { AppError } from '../errors/app-error.js';
import { logger } from '../utils/logger.js';
import { sendError } from '../utils/response.js';
import { config } from '../config/environment.js';

export const errorHandler: ErrorRequestHandler = (error: unknown, _req: Request, res: Response, _next: NextFunction): void => {
  if (error instanceof AppError) {
    logger.error(error.message, { statusCode: error.statusCode, details: error.details, environment: config.environment });
    sendError(res, error.statusCode, error.message, undefined, config.environment === 'development' ? error.details : undefined);
    return;
  }

  if (error instanceof Error) {
    logger.error('Unhandled error', { message: error.message, environment: config.environment });
    sendError(res, 500, 'Internal Server Error', undefined, config.environment === 'development' ? error.message : undefined);
    return;
  }

  logger.error('Unknown error', { error, environment: config.environment });
  sendError(res, 500, 'Internal Server Error');
};
