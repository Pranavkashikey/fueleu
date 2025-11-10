import type { IRouteRepository } from '../ports/outbound/IRouteRepository';
import type { Route } from '../../domain/entities/Route';

export class GetRoutesUseCase {
  private routeRepository: IRouteRepository;

  constructor(routeRepository: IRouteRepository) {
    this.routeRepository = routeRepository;
  }

  async execute(filters?: { year?: number; vesselType?: string; fuelType?: string }): Promise<Route[]> {
    return await this.routeRepository.findAll(filters);
  }
}
