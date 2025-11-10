import { PrismaClient } from '@prisma/client';

// All Repositories
import { RouteRepository } from '../../adapters/outbound/postgres/repositories/RouteRepository';
import { ComplianceRepository } from '../../adapters/outbound/postgres/repositories/ComplianceRepository';
import { BankingRepository } from '../../adapters/outbound/postgres/repositories/BankingRepository';
import { PoolRepository } from '../../adapters/outbound/postgres/repositories/PoolRepository';

// All Use Cases
import { GetRoutesUseCase } from '../../core/application/useCases/GetRoutesUseCase';
import { SetBaselineUseCase } from '../../core/application/useCases/SetBaselineUseCase';
import { GetComparisonUseCase } from '../../core/application/useCases/GetComparisonUseCase';
import { GetComplianceBalanceUseCase } from '../../core/application/useCases/GetComplianceBalanceUseCase';
import { ComputeComplianceBalanceUseCase } from '../../core/application/useCases/ComputeComplianceBalanceUseCase';
import { GetAdjustedCBUseCase } from '../../core/application/useCases/GetAdjustedCBUseCase';
import { BankSurplusUseCase } from '../../core/application/useCases/BankSurplusUseCase';
import { ApplyBankedUseCase } from '../../core/application/useCases/ApplyBankedUseCase';
import { CreatePoolUseCase } from '../../core/application/useCases/CreatePoolUseCase';

// All Controllers
import { RouteController } from '../../adapters/inbound/http/controllers/RouteController';
import { ComplianceController } from '../../adapters/inbound/http/controllers/ComplianceController';
import { BankingController } from '../../adapters/inbound/http/controllers/BankingController';
import { PoolingController } from '../../adapters/inbound/http/controllers/PoolingController';

export class Container {
  private prisma: PrismaClient;

  // Repositories
  public routeRepository: RouteRepository;
  public complianceRepository: ComplianceRepository;
  public bankingRepository: BankingRepository;
  public poolRepository: PoolRepository;

  // Controllers
  public routeController: RouteController;
  public complianceController: ComplianceController;
  public bankingController: BankingController;
  public poolingController: PoolingController;

  constructor() {
   
    this.prisma = new PrismaClient();

    
    this.routeRepository = new RouteRepository(this.prisma);
    this.complianceRepository = new ComplianceRepository(this.prisma);
    this.bankingRepository = new BankingRepository(this.prisma);
    this.poolRepository = new PoolRepository(this.prisma);

   
    const getRoutesUseCase = new GetRoutesUseCase(this.routeRepository);
    const setBaselineUseCase = new SetBaselineUseCase(this.routeRepository);
    const getComparisonUseCase = new GetComparisonUseCase(this.routeRepository);
    
    const getComplianceBalanceUseCase = new GetComplianceBalanceUseCase(this.complianceRepository);
    const computeComplianceBalanceUseCase = new ComputeComplianceBalanceUseCase(this.complianceRepository);
    const getAdjustedCBUseCase = new GetAdjustedCBUseCase(this.complianceRepository, this.bankingRepository);
    
    const bankSurplusUseCase = new BankSurplusUseCase(this.bankingRepository, this.complianceRepository);
    const applyBankedUseCase = new ApplyBankedUseCase(this.bankingRepository, this.complianceRepository);
    
    const createPoolUseCase = new CreatePoolUseCase(this.poolRepository, this.complianceRepository);

    
    this.routeController = new RouteController(getRoutesUseCase, setBaselineUseCase, getComparisonUseCase);
    this.complianceController = new ComplianceController(getComplianceBalanceUseCase, computeComplianceBalanceUseCase, getAdjustedCBUseCase);
    this.bankingController = new BankingController(bankSurplusUseCase, applyBankedUseCase);
    this.poolingController = new PoolingController(createPoolUseCase);
  }

  async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }
}
