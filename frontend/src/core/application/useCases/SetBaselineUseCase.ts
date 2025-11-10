import type { IApiClient } from '../ports/outbound/IApiClient';

export class SetBaselineUseCase {
  private apiClient: IApiClient;

  constructor(apiClient: IApiClient) {
    this.apiClient = apiClient;
  }

  async execute(routeId: string): Promise<void> {
    await this.apiClient.post(`/routes/${routeId}/baseline`);
  }
}
