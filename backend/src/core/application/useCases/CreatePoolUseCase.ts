import type { IPoolRepository } from '../ports/outbound/IPoolRepository';
import type { IComplianceRepository } from '../ports/outbound/IComplianceRepository';
import type { CreatePoolRequest, PoolAllocation } from '../../domain/entities/Pooling';

export class CreatePoolUseCase {
  private poolRepository: IPoolRepository;
  private complianceRepository: IComplianceRepository;

  constructor(poolRepository: IPoolRepository, complianceRepository: IComplianceRepository) {
    this.poolRepository = poolRepository;
    this.complianceRepository = complianceRepository;
  }

async execute(request: CreatePoolRequest): Promise<{ poolId: number; allocations: PoolAllocation[] }> {
  const { year, members } = request;

  console.log('🔍 CreatePool UseCase - Input:', { year, members });

  if (members.length < 2) {
    throw new Error('Pool must have at least 2 members');
  }

  // Fetch compliance balances
  const memberData: Array<{ shipId: string; shipName: string; cbBefore: number }> = [];
  
  for (const shipId of members) {
    const compliance = await this.complianceRepository.findByShipAndYear(shipId, year);
    
    if (!compliance) {
      throw new Error(`No compliance balance found for ship ${shipId} in year ${year}`);
    }

    memberData.push({
      shipId,
      shipName: `Ship-${shipId}`,
      cbBefore: compliance.cbGco2eq
    });
  }

  // Calculate pool sum
  const poolSum = memberData.reduce((sum, m) => sum + m.cbBefore, 0);

  if (poolSum < 0) {
    throw new Error(`Invalid pool: Sum of CB (${poolSum}) is negative`);
  }

  // Greedy allocation
  const allocations = this.greedyAllocation(memberData);

  // Validate constraints
  this.validatePoolConstraints(memberData, allocations);

  // Create pool in database
  const poolMembers = allocations.map(alloc => ({
    shipId: alloc.shipId,
    shipName: alloc.shipName,
    cbBefore: alloc.cbBefore,
    cbAfter: alloc.cbAfter
  }));

  const pool = await this.poolRepository.create(year, poolMembers);

  // ✅ UPDATE: Write updated CB back to compliance table
  for (const alloc of allocations) {
    const compliance = await this.complianceRepository.findByShipAndYear(alloc.shipId, year);
    if (compliance) {
      await this.complianceRepository.update(compliance.id, alloc.cbAfter);
    }
  }

  return {
    poolId: pool.id,
    allocations
  };
}


  private greedyAllocation(members: Array<{ shipId: string; shipName: string; cbBefore: number }>): PoolAllocation[] {
    
    const sorted = [...members].sort((a, b) => b.cbBefore - a.cbBefore);

    const allocations: PoolAllocation[] = sorted.map(m => ({
      shipId: m.shipId,
      shipName: m.shipName,
      cbBefore: m.cbBefore,
      cbAfter: m.cbBefore,
      allocated: 0
    }));

   
    for (let i = 0; i < allocations.length; i++) {
      const surplus = allocations[i];
      
      if (surplus.cbAfter <= 0) break; 

      for (let j = allocations.length - 1; j > i; j--) {
        const deficit = allocations[j];
        
        if (deficit.cbAfter >= 0) continue;

        const transferAmount = Math.min(surplus.cbAfter, -deficit.cbAfter);
        
        surplus.cbAfter -= transferAmount;
        surplus.allocated -= transferAmount;
        deficit.cbAfter += transferAmount;
        deficit.allocated += transferAmount;

        if (surplus.cbAfter <= 0) break;
      }
    }

    return allocations;
  }

  private validatePoolConstraints(
    original: Array<{ shipId: string; cbBefore: number }>,
    allocations: PoolAllocation[]
  ): void {
    for (const alloc of allocations) {
      const originalCB = original.find(m => m.shipId === alloc.shipId)?.cbBefore || 0;

      
      if (originalCB < 0 && alloc.cbAfter < originalCB) {
        throw new Error(`Deficit ship ${alloc.shipId} exits worse than entry`);
      }

      
      if (originalCB > 0 && alloc.cbAfter < 0) {
        throw new Error(`Surplus ship ${alloc.shipId} exits with negative CB`);
      }
    }
  }
}
