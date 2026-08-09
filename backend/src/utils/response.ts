import type { Response } from 'express';
import type { ApiResponse } from '../types/http.js';

export const sendSuccess = <T>(res: Response, data: T, message = 'Request completed successfully'): Response<ApiResponse<T>> => {
  return res.status(200).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
};

export const sendError = (res: Response, statusCode: number, message: string, error?: string, details?: unknown): Response<ApiResponse> => {
  return res.status(statusCode).json({
    success: false,
    message,
    error,
    details,
    timestamp: new Date().toISOString()
  });
};
