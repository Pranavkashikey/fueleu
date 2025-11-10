import type { IBankingRepository } from '../ports/outbound/IBankingRepository';
import type { IComplianceRepository } from '../ports/outbound/IComplianceRepository';
import type { BankingResponse } from '../../domain/entities/Banking';

export class ApplyBankedUseCase {
  private bankingRepository: IBankingRepository;
  private complianceRepository: IComplianceRepository;

  constructor(bankingRepository: IBankingRepository, complianceRepository: IComplianceRepository) {
    this.bankingRepository = bankingRepository;
    this.complianceRepository = complianceRepository;
  }

  async execute(shipId: string, year: number, amount: number): Promise<BankingResponse> {
   
    if (amount <= 0) {
      throw new Error('Apply amount must be positive');
    }

   
    const totalBanked = await this.bankingRepository.getTotalBanked(shipId, year);
    const totalApplied = await this.bankingRepository.getTotalApplied(shipId, year);
    const availableBanked = totalBanked - totalApplied;

   
    if (amount > availableBanked) {
      throw new Error(`Requested amount ${amount} exceeds available banked ${availableBanked}`);
    }

    
    const compliance = await this.complianceRepository.findByShipAndYear(shipId, year);
    
    if (!compliance) {
      throw new Error(`No compliance balance found for ship ${shipId} in year ${year}`);
    }

    const cbBefore = compliance.cbGco2eq;

    
    const cbAfter = cbBefore + amount;
    await this.complianceRepository.update(compliance.id, cbAfter);

   
    const bankEntries = await this.bankingRepository.findByShipAndYear(shipId, year);
    let remainingToApply = amount;
    
    for (const entry of bankEntries) {
      if (!entry.isApplied && remainingToApply > 0) {
        const applyAmount = Math.min(entry.amountGco2eq, remainingToApply);
        await this.bankingRepository.markAsApplied(entry.id);
        remainingToApply -= applyAmount;
      }
    }

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
