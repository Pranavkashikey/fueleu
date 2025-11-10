import { PrismaClient } from '@prisma/client';
import type { IBankingRepository } from '../../../../core/application/ports/outbound/IBankingRepository';
import type { BankEntry } from '../../../../core/domain/entities/Banking';

export class BankingRepository implements IBankingRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findByShipAndYear(shipId: string, year: number): Promise<BankEntry[]> {
    return await this.prisma.bankEntry.findMany({
      where: { shipId, year },
      orderBy: { createdAt: 'asc' }
    });
  }

  async getTotalBanked(shipId: string, year: number): Promise<number> {
    const entries = await this.prisma.bankEntry.findMany({
      where: { shipId, year }
    });

    
    return entries.reduce((sum: number, entry: { amountGco2eq: number; }) => sum + entry.amountGco2eq, 0);
  }

  async getTotalApplied(shipId: string, year: number): Promise<number> {
    const entries = await this.prisma.bankEntry.findMany({
      where: { shipId, year, isApplied: true }
    });

    // ✅ Fix: Explicit type for sum parameter
    return entries.reduce((sum: number, entry: { amountGco2eq: number; }) => sum + entry.amountGco2eq, 0);
  }

  async create(shipId: string, year: number, amount: number): Promise<BankEntry> {
    return await this.prisma.bankEntry.create({
      data: { shipId, year, amountGco2eq: amount, isApplied: false }
    });
  }

  async markAsApplied(id: number): Promise<BankEntry> {
    return await this.prisma.bankEntry.update({
      where: { id },
      data: { isApplied: true }
    });
  }
}
