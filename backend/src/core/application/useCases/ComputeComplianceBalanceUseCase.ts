import type { IComplianceRepository } from '../ports/outbound/IComplianceRepository';
import type { ComplianceCalculation } from '../../domain/entities/Compliance';
import { TARGET_INTENSITY_2025, ENERGY_PER_TON_FUEL } from '../../../shared/constants';

export class ComputeComplianceBalanceUseCase {
  private complianceRepository: IComplianceRepository;

  constructor(complianceRepository: IComplianceRepository) {
    this.complianceRepository = complianceRepository;
  }

  async execute(shipId: string, year: number, actualIntensity: number, fuelConsumption: number): Promise<ComplianceCalculation> {
    
    const energyInScope = fuelConsumption * ENERGY_PER_TON_FUEL;

 
    const complianceBalance = (TARGET_INTENSITY_2025 - actualIntensity) * energyInScope;

    
    const existing = await this.complianceRepository.findByShipAndYear(shipId, year);
    
    if (existing) {
      await this.complianceRepository.update(existing.id, complianceBalance);
    } else {
      await this.complianceRepository.create(shipId, year, complianceBalance);
    }

    return {
      shipId,
      year,
      targetIntensity: TARGET_INTENSITY_2025,
      actualIntensity,
      energyInScope,
      complianceBalance
    };
  }
}
