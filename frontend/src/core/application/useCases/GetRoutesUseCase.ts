import type { IApiClient } from '../ports/outbound/IApiClient';
import type { Route, RouteFilters } from '../../domain/entities/Route';

export class GetRoutesUseCase {
  private apiClient: IApiClient;

  constructor(apiClient: IApiClient) {
    this.apiClient = apiClient;
  }

  async execute(filters?: RouteFilters): Promise<Route[]> {
    return await this.apiClient.get<Route[]>('/routes', filters);
  }
}
