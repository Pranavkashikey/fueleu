import { PrismaClient } from '@prisma/client';
import type { IPoolRepository } from '../../../../core/application/ports/outbound/IPoolRepository';
import type { Pool } from '../../../../core/domain/entities/Pooling';

export class PoolRepository implements IPoolRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(year: number, members: Array<{ shipId: string; shipName: string; cbBefore: number; cbAfter: number }>): Promise<Pool> {
    return await this.prisma.pool.create({
      data: {
        year,
        members: {
          create: members
        }
      },
      include: {
        members: true
      }
    });
  }

  async findById(id: number): Promise<Pool | null> {
    return await this.prisma.pool.findUnique({
      where: { id },
      include: { members: true }
    });
  }

  async findByYear(year: number): Promise<Pool[]> {
    return await this.prisma.pool.findMany({
      where: { year },
      include: { members: true },
      orderBy: { createdAt: 'desc' }
    });
  }
}
