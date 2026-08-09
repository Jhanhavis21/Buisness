import axios from 'axios';
import type { ApiHealthResponse, ApiSuccessResponse, MondayItem, ChatInput, ChatResponse, SystemStatus } from '../types/api';

const configuredBaseUrl = (import.meta.env.VITE_API_URL ?? '').trim();
const fallbackLocalBaseUrl = import.meta.env.DEV ? 'http://localhost:3001' : '';
const baseURL = (configuredBaseUrl || fallbackLocalBaseUrl).replace(/\/$/, '');

const apiClient = axios.create({
  baseURL,
  timeout: 10000
});

export const apiService = {
  getHealth: async (): Promise<ApiSuccessResponse<ApiHealthResponse>> => {
    const response = await apiClient.get('/api/health');
    return response.data;
  },

  getDeals: async (): Promise<ApiSuccessResponse<MondayItem[]>> => {
    const response = await apiClient.get('/api/monday/deals');
    return response.data;
  },

  getWorkOrders: async (): Promise<ApiSuccessResponse<MondayItem[]>> => {
    const response = await apiClient.get('/api/monday/work-orders');
    return response.data;
  },

  sendChatMessage: async (payload: ChatInput): Promise<ApiSuccessResponse<ChatResponse>> => {
    const response = await apiClient.post('/api/chat', payload);
    return response.data;
  },

  getSystemStatus: async (): Promise<ApiSuccessResponse<SystemStatus>> => {
    const response = await apiClient.get('/api/status');
    return response.data;
  }
};
