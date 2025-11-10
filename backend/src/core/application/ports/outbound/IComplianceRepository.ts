import type { ComplianceBalance } from '../../../domain/entities/Compliance';

export interface IComplianceRepository {
  findByShipAndYear(shipId: string, year: number): Promise<ComplianceBalance | null>;
  create(shipId: string, year: number, cbGco2eq: number): Promise<ComplianceBalance>;
  update(id: number, cbGco2eq: number): Promise<ComplianceBalance>;
}
