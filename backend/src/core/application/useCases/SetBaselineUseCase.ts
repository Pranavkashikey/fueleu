import type { IRouteRepository } from '../ports/outbound/IRouteRepository';
import type { Route } from '../../domain/entities/Route';

export class SetBaselineUseCase {
  private routeRepository: IRouteRepository;

  constructor(routeRepository: IRouteRepository) {
    this.routeRepository = routeRepository;
  }

  async execute(routeId: string): Promise<Route> {
    const route = await this.routeRepository.findByRouteId(routeId);
    
    if (!route) {
      throw new Error(`Route ${routeId} not found`);
    }

    return await this.routeRepository.setBaseline(routeId);
  }
}
