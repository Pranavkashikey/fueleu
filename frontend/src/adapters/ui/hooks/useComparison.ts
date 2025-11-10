import { useState, useEffect } from 'react';
import type { ComparisonData } from '../../../core/domain/entities/Comparison';
import { GetComparisonUseCase } from '../../../core/application/useCases/GetComparisonUseCase';
import { ApiClient } from '../../infrastructure/api/ApiClient';

const apiClient = new ApiClient('http://localhost:3000/api');
const getComparisonUseCase = new GetComparisonUseCase(apiClient);

export const useComparison = () => {
  const [data, setData] = useState<ComparisonData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComparison = async () => {
    setLoading(true);
    setError(null);
    try {
      const comparisonData = await getComparisonUseCase.execute();
      setData(comparisonData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch comparison data');
      console.error('Comparison fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComparison();
  }, []);

  return { 
    data, 
    loading, 
    error, 
    refreshComparison: fetchComparison 
  };
};
