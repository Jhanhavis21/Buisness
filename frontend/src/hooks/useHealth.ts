import { useQuery } from '@tanstack/react-query';
import { apiService } from '../services/api';

export const useHealth = () => {
  return useQuery({
    queryKey: ['health'],
    queryFn: apiService.getHealth,
    refetchInterval: 30000
  });
};
