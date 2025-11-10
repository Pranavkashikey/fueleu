import { PrismaClient } from '@prisma/client';
import type { IComplianceRepository } from '../../../../core/application/ports/outbound/IComplianceRepository';
import type { ComplianceBalance } from '../../../../core/domain/entities/Compliance';

export class ComplianceRepository implements IComplianceRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findByShipAndYear(shipId: string, year: number): Promise<ComplianceBalance | null> {
    return await this.prisma.shipCompliance.findUnique({
      where: {
        shipId_year: { shipId, year }
      }
    });
  }

  async create(shipId: string, year: number, cbGco2eq: number): Promise<ComplianceBalance> {
    return await this.prisma.shipCompliance.create({
      data: { shipId, year, cbGco2eq }
    });
  }

  async update(id: number, cbGco2eq: number): Promise<ComplianceBalance> {
    return await this.prisma.shipCompliance.update({
      where: { id },
      data: { cbGco2eq }
    });
  }
}
