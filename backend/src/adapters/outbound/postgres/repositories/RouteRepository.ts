import { PrismaClient } from '@prisma/client';
import type { IRouteRepository } from '../../../../core/application/ports/outbound/IRouteRepository';
import type { Route, CreateRouteDTO } from '../../../../core/domain/entities/Route';

export class RouteRepository implements IRouteRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findAll(filters?: { year?: number; vesselType?: string; fuelType?: string }): Promise<Route[]> {
    return await this.prisma.route.findMany({
      where: {
        year: filters?.year,
        vesselType: filters?.vesselType,
        fuelType: filters?.fuelType
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findById(id: number): Promise<Route | null> {
    return await this.prisma.route.findUnique({ where: { id } });
  }

  async findByRouteId(routeId: string): Promise<Route | null> {
    return await this.prisma.route.findUnique({ where: { routeId } });
  }

  async findBaseline(): Promise<Route | null> {
    return await this.prisma.route.findFirst({ where: { isBaseline: true } });
  }

  async create(data: CreateRouteDTO): Promise<Route> {
    return await this.prisma.route.create({ data });
  }

  async setBaseline(routeId: string): Promise<Route> {
   
    await this.prisma.route.updateMany({
      where: { isBaseline: true },
      data: { isBaseline: false }
    });

   
    return await this.prisma.route.update({
      where: { routeId },
      data: { isBaseline: true }
    });
  }
}
