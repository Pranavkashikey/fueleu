import type { Route, CreateRouteDTO } from '../../../domain/entities/Route';

export interface IRouteRepository {
  findAll(filters?: { year?: number; vesselType?: string; fuelType?: string }): Promise<Route[]>;
  findById(id: number): Promise<Route | null>;
  findByRouteId(routeId: string): Promise<Route | null>;
  findBaseline(): Promise<Route | null>;
  create(data: CreateRouteDTO): Promise<Route>;
  setBaseline(routeId: string): Promise<Route>;
}
