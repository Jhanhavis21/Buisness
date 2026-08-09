import type { HealthResponse } from '../types/http.js';

export class HealthService {
  public getHealth(): HealthResponse {
    return {
      status: 'ok',
      service: 'skylark-drones-backend',
      environment: process.env.NODE_ENV || 'development',
      uptime: Math.round(process.uptime()),
      timestamp: new Date().toISOString()
    };
  }
}
