import path from 'node:path';
import { existsSync } from 'node:fs';
import dotenv from 'dotenv';
import type { AppConfig } from '../types/http.js';
import { AppError } from '../errors/app-error.js';

const findEnvFile = (): string | undefined => {
  const candidates = [
    path.resolve(process.cwd(), '.env'),
    path.resolve(process.cwd(), '..', '.env'),
    path.resolve(process.cwd(), '..', '..', '.env')
  ];

  for (const candidate of candidates) {
    if (candidate && existsSync(candidate)) {
      return candidate;
    }
  }

  return undefined;
};

class ConfigService {
  private config: AppConfig;

  constructor() {
    const envPath = findEnvFile();
    if (envPath) {
      dotenv.config({ path: envPath });
    } else {
      dotenv.config();
    }

    this.config = this.loadConfig();
  }

  private loadConfig(): AppConfig {
    const environment = process.env.NODE_ENV || 'development';
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const port = Number(process.env.PORT || '3001');
    const geminiApiKey = process.env.GEMINI_API_KEY || '';

    if (!Number.isInteger(port) || port <= 0) {
      throw new AppError('PORT must be a valid positive integer', 500);
    }

    if (!['development', 'production', 'test'].includes(environment)) {
      throw new AppError('NODE_ENV must be one of development, production, or test', 500);
    }

    try {
      new URL(frontendUrl);
    } catch {
      throw new AppError('FRONTEND_URL must be a valid URL', 500);
    }

    return {
      port,
      environment,
      frontendUrl,
      geminiApiKey
    };
  }

  public getConfig(): AppConfig {
    return this.config;
  }
}

export const configService = new ConfigService();
export const config = configService.getConfig();
