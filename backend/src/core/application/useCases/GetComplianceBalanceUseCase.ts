import type { IComplianceRepository } from '../ports/outbound/IComplianceRepository';
import type { ComplianceBalance } from '../../domain/entities/Compliance';

export class GetComplianceBalanceUseCase {
  private complianceRepository: IComplianceRepository;

  constructor(complianceRepository: IComplianceRepository) {
    this.complianceRepository = complianceRepository;
  }

  async execute(shipId: string, year: number): Promise<ComplianceBalance | null> {
    return await this.complianceRepository.findByShipAndYear(shipId, year);
  }
}
