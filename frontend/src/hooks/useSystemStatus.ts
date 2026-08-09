import { useQuery } from '@tanstack/react-query';
import { apiService } from '../services/api';

export const useSystemStatus = () => {
  return useQuery({
    queryKey: ['systemStatus'],
    queryFn: apiService.getSystemStatus,
    refetchInterval: 30000
  });
};
