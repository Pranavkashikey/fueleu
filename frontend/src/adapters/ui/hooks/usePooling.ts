import { useState } from 'react';
import type { PoolMember, CreatePoolRequest } from '../../../core/domain/entities/Pool';
import { 
  GetAdjustedCBUseCase,
  CreatePoolUseCase 
} from '../../../core/application/useCases/PoolingUseCases';
import { ApiClient } from '../../infrastructure/api/ApiClient';

const apiClient = new ApiClient('http://localhost:3000/api');
const getAdjustedCBUseCase = new GetAdjustedCBUseCase(apiClient);
const createPoolUseCase = new CreatePoolUseCase(apiClient);

export const usePooling = () => {
  const [members, setMembers] = useState<PoolMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMembers = async (year: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdjustedCBUseCase.execute(year);
      setMembers(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch pool members');
      console.error('Pool members fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

const createPool = async (request: CreatePoolRequest) => {
  setLoading(true);
  setError(null);
  try {
    const result = await createPoolUseCase.execute(request);
    console.log('Pool Created:', result);
    
    
    return { success: true, data: result };
  } catch (err: any) {
    setError(err.message || 'Failed to create pool');
    console.error('Create pool error:', err);
    return { success: false, error: err.message };
  } finally {
    setLoading(false);
  }
};


  return {
    members,
    loading,
    error,
    fetchMembers,
    createPool
  };
};
