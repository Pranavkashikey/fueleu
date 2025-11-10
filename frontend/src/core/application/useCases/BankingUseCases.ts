import type { IApiClient } from '../ports/outbound/IApiClient';
import type { ComplianceBalance, BankingRequest, BankingResponse } from '../../domain/entities/ComplianceBalance';

export class GetComplianceBalanceUseCase {
  private apiClient: IApiClient;

  constructor(apiClient: IApiClient) {
    this.apiClient = apiClient;
  }


  async execute(shipId: string, year: number): Promise<ComplianceBalance> {
    return await this.apiClient.get<ComplianceBalance>(
      `/compliance/cb?shipId=${shipId}&year=${year}`
    );
  }
}

export class BankSurplusUseCase {
  private apiClient: IApiClient;

  constructor(apiClient: IApiClient) {
    this.apiClient = apiClient;
  }

  async execute(shipId: string, year: number, amount: number) {
    return this.apiClient.post('/banking/bank', { shipId, year, amount });
  }
}

export class ApplyBankedUseCase {
  private apiClient: IApiClient;

  constructor(apiClient: IApiClient) {
    this.apiClient = apiClient;
  }

  async execute(request: BankingRequest): Promise<BankingResponse> {
    return await this.apiClient.post<BankingResponse>('/banking/apply', request);
  }
}


export class GetBankingRecordsUseCase {
  private apiClient: IApiClient;

  constructor(apiClient: IApiClient) {
    this.apiClient = apiClient;
  }

  async execute(shipId: string, year: number): Promise<{
    totalBanked: number;
    totalApplied: number;
    availableBanked: number;
    entries: Array<{
      id: number;
      amount: number;
      isApplied: boolean;
      createdAt: string;
    }>;
  }> {
    return await this.apiClient.get(
      `/banking/records?shipId=${shipId}&year=${year}`
    );
  }
}

