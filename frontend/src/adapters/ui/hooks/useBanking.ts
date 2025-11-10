import { useState } from 'react';
import type { ComplianceBalance, BankingRequest } from '../../../core/domain/entities/ComplianceBalance';
import { 
  GetComplianceBalanceUseCase,
  BankSurplusUseCase,
  ApplyBankedUseCase ,
  GetBankingRecordsUseCase
} from '../../../core/application/useCases/BankingUseCases';
import { ApiClient } from '../../infrastructure/api/ApiClient';

const apiClient = new ApiClient('http://localhost:3000/api');
const getCBUseCase = new GetComplianceBalanceUseCase(apiClient);
const bankSurplusUseCase = new BankSurplusUseCase(apiClient);
const applyBankedUseCase = new ApplyBankedUseCase(apiClient);
const getBankingRecordsUseCase = new GetBankingRecordsUseCase(apiClient);

export const useBanking = () => {
  const [cb, setCb] = useState<ComplianceBalance | null>(null);
  const [availableBanked, setAvailableBanked] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

   const fetchBankingRecords = async (shipId: string, year: number) => {
    try {
      const records = await getBankingRecordsUseCase.execute(shipId, year);
      setAvailableBanked(records.availableBanked);
      console.log(' Available Banked:', records.availableBanked);
    } catch (err: any) {
      console.error('Banking records fetch error:', err);
    }
  };

  const fetchCB = async (shipId: string, year: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCBUseCase.execute(shipId, year);
      setCb(data);
      await fetchBankingRecords(shipId, year);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch compliance balance');
      console.error('CB fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

 const bankSurplus = async (request: BankingRequest) => {
  setLoading(true);
  setError(null);
  try {
    
    const response = await bankSurplusUseCase.execute(
      request.shipId,
      request.year,
      request.amount
    );
    await fetchBankingRecords(request.shipId, request.year);
    
    setCb({
      id: 0, 
      shipId: request.shipId,
      year: request.year,
      cbGco2eq: response.cbAfter,
      createdAt: new Date()
    });

    return { success: true, data: response };
  } catch (err: any) {
    console.error('Bank surplus error:', err);
    setError(err.message || 'Failed to bank surplus');
    return { success: false, error: err.message };
  } finally {
    setLoading(false);
  }
};


 const applyBanked = async (request: BankingRequest) => {
  setLoading(true);
  setError(null);
  try {
    const response = await applyBankedUseCase.execute(request);
    console.log('✅ Apply Banked Response:', response);
    
  
    await fetchCB(request.shipId, request.year);
    await fetchBankingRecords(request.shipId, request.year);
    return { success: true, data: response };
  } catch (err: any) {
    setError(err.message || 'Failed to apply banked amount');
    console.error('Apply banked error:', err);
    return { success: false, error: err.message };
  } finally {
    setLoading(false);
  }
};


  return {
    cb,
    availableBanked,
    loading,
    error,
    fetchCB,
    bankSurplus,
    applyBanked
  };
};
