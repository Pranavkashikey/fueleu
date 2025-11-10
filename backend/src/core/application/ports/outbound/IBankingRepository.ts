import type { BankEntry } from '../../../domain/entities/Banking';

export interface IBankingRepository {
  findByShipAndYear(shipId: string, year: number): Promise<BankEntry[]>;
  getTotalBanked(shipId: string, year: number): Promise<number>;
  getTotalApplied(shipId: string, year: number): Promise<number>;
  create(shipId: string, year: number, amount: number): Promise<BankEntry>;
  markAsApplied(id: number): Promise<BankEntry>;
}
