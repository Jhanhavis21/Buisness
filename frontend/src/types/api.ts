export interface ApiHealthResponse {
  status: 'ok';
  service: string;
  environment: string;
  uptime: number;
  timestamp: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  error?: string;
  timestamp: string;
}

export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
  timestamp: string;
}

export interface ChatInput {
  message: string;
}

export interface ChatResponse {
  input?: string;
  reply: string;
}

export interface HealthStatus {
  status: 'ok';
  service: string;
  environment: string;
  uptime: number;
  timestamp: string;
}

export interface MondayIntegrationStatus {
  configured: boolean;
  boardIds: {
    deals?: string;
    workOrders?: string;
  };
}

export interface SystemStatus {
  health: HealthStatus;
  monday: MondayIntegrationStatus;
  lastSyncedAt: string;
}

export interface MondayColumnValue {
  id: string;
  title?: string;
  text?: string;
  value?: string | null;
}

export interface MondayItem {
  id: string;
  name?: string;
  column_values?: MondayColumnValue[];
  [key: string]: unknown;
}
