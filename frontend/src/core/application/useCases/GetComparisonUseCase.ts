import type { IApiClient } from '../ports/outbound/IApiClient';
import type { ComparisonData } from '../../domain/entities/Comparison';
import { TARGET_INTENSITY } from '../../domain/entities/Comparison';

export class GetComparisonUseCase {
  private apiClient: IApiClient;

  constructor(apiClient: IApiClient) {
    this.apiClient = apiClient;
  }

  async execute(): Promise<ComparisonData[]> {
    const response = await this.apiClient.get<any[]>('/routes/comparison');
    
    return response.map(item => ({
      routeId: item.routeId,
      baseline: item.baseline,
      comparison: item.comparison,
      percentDiff: ((item.comparison / item.baseline) - 1) * 100,
      compliant: item.comparison <= TARGET_INTENSITY
    }));
  }
}
