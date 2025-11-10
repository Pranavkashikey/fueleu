import { useState, useEffect } from 'react';
import type { Route, RouteFilters } from '../../../core/domain/entities/Route';
import { GetRoutesUseCase } from '../../../core/application/useCases/GetRoutesUseCase';
import { SetBaselineUseCase } from '../../../core/application/useCases/SetBaselineUseCase';
import { ApiClient } from '../../infrastructure/api/ApiClient';

const apiClient = new ApiClient('http://localhost:3000/api');
const getRoutesUseCase = new GetRoutesUseCase(apiClient);
const setBaselineUseCase = new SetBaselineUseCase(apiClient);

export const useRoutes = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRoutes = async (filters?: RouteFilters) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRoutesUseCase.execute(filters);
      setRoutes(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch routes');
      console.error('Routes fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const setBaseline = async (routeId: string) => {
    try {
      await setBaselineUseCase.execute(routeId);
      await fetchRoutes(); // Refresh list
      return { success: true };
    } catch (err: any) {
      setError(err.message || 'Failed to set baseline');
      console.error('Set baseline error:', err);
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  return { 
    routes, 
    loading, 
    error, 
    fetchRoutes, 
    setBaseline 
  };
};
