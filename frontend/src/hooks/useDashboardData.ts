import { useQueries } from '@tanstack/react-query';
import { apiService } from '../services/api';

export const useDashboardData = () => {
  const results = useQueries({
    queries: [
      {
        queryKey: ['monday', 'deals'],
        queryFn: apiService.getDeals,
        refetchInterval: 30000
      },
      {
        queryKey: ['monday', 'workOrders'],
        queryFn: apiService.getWorkOrders,
        refetchInterval: 30000
      }
    ]
  });

  const [dealsQuery, workOrdersQuery] = results;

  const deals = dealsQuery.data?.data ?? [];
  const workOrders = workOrdersQuery.data?.data ?? [];
  const isLoading = dealsQuery.isLoading || workOrdersQuery.isLoading;
  const isError = dealsQuery.isError || workOrdersQuery.isError;
  const error = dealsQuery.error ?? workOrdersQuery.error;

  return {
    deals,
    workOrders,
    isLoading,
    isError,
    error
  };
};
