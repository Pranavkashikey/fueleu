import type { IComplianceRepository } from '../ports/outbound/IComplianceRepository';
import type { IBankingRepository } from '../ports/outbound/IBankingRepository';
import type { AdjustedComplianceBalance } from '../../domain/entities/Compliance';

export class GetAdjustedCBUseCase {
  private complianceRepository: IComplianceRepository;
  private bankingRepository: IBankingRepository;

  constructor(complianceRepository: IComplianceRepository, bankingRepository: IBankingRepository) {
    this.complianceRepository = complianceRepository;
    this.bankingRepository = bankingRepository;
  }

  async execute(shipId: string, year: number): Promise<AdjustedComplianceBalance | null> {
    const compliance = await this.complianceRepository.findByShipAndYear(shipId, year);
    
    if (!compliance) {
      return null;
    }

    const totalApplied = await this.bankingRepository.getTotalApplied(shipId, year);
    const cbAfter = compliance.cbGco2eq + totalApplied;

    return {
      shipId,
      year,
      cbBefore: compliance.cbGco2eq,
      bankedApplied: totalApplied,
      cbAfter
    };
  }
}
