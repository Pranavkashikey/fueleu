import type { Pool, PoolMember } from '../../../domain/entities/Pooling';

export interface IPoolRepository {
  create(year: number, members: Array<{ shipId: string; shipName: string; cbBefore: number; cbAfter: number }>): Promise<Pool>;
  findById(id: number): Promise<Pool | null>;
  findByYear(year: number): Promise<Pool[]>;
}
