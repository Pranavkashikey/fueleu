import type { IApiClient } from '../ports/outbound/IApiClient';
import type { PoolMember, CreatePoolRequest } from '../../domain/entities/Pool';

export class GetAdjustedCBUseCase {
  private apiClient: IApiClient;

  constructor(apiClient: IApiClient) {
    this.apiClient = apiClient;
  }

  async execute(year: number): Promise<PoolMember[]> {
    return await this.apiClient.get<PoolMember[]>(`/compliance/adjusted-cb?year=${year}`);
  }
}

export class CreatePoolUseCase {
  private apiClient: IApiClient;

  constructor(apiClient: IApiClient) {
    this.apiClient = apiClient;
  }

  async execute(request: CreatePoolRequest): Promise<void> {
    await this.apiClient.post('/pools', request);
  }
}
