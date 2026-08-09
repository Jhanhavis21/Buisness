export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  details?: unknown;
  timestamp: string;
}

export interface HealthResponse {
  status: 'ok';
  service: string;
  environment: string;
  uptime: number;
  timestamp: string;
}

export interface AppConfig {
  port: number;
  environment: string;
  frontendUrl: string;
  geminiApiKey: string;
}