import type { IBankingRepository } from '../ports/outbound/IBankingRepository';
import type { IComplianceRepository } from '../ports/outbound/IComplianceRepository';
import type { BankingResponse } from '../../domain/entities/Banking';

export class BankSurplusUseCase {
  private bankingRepository: IBankingRepository;
  private complianceRepository: IComplianceRepository;

  constructor(bankingRepository: IBankingRepository, complianceRepository: IComplianceRepository) {
    this.bankingRepository = bankingRepository;
    this.complianceRepository = complianceRepository;
  }

  async execute(shipId: string, year: number, amount: number): Promise<BankingResponse> {
    
    if (amount <= 0) {
      throw new Error('Banking amount must be positive');
    }

    
    const compliance = await this.complianceRepository.findByShipAndYear(shipId, year);
    
    if (!compliance) {
      throw new Error(`No compliance balance found for ship ${shipId} in year ${year}`);
    }

    const cbBefore = compliance.cbGco2eq;

    
    if (cbBefore <= 0) {
      throw new Error('Cannot bank negative or zero compliance balance');
    }

    
    if (amount > cbBefore) {
      throw new Error(`Amount ${amount} exceeds available balance ${cbBefore}`);
    }

    
    await this.bankingRepository.create(shipId, year, amount);

   
    const cbAfter = cbBefore - amount;
    await this.complianceRepository.update(compliance.id, cbAfter);

    return {
      success: true,
      shipId,
      year,
      cbBefore,
      applied: amount,
      cbAfter
    };
  }
}
