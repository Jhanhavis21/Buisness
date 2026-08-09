export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public details?: unknown;

  constructor(message: string, statusCode = 500, isOperational = true, details?: unknown) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;
  }
}
