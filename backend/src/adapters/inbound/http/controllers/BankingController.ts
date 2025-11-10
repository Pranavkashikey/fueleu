import { Request, Response } from 'express';
import { BankSurplusUseCase } from '../../../../core/application/useCases/BankSurplusUseCase';
import { ApplyBankedUseCase } from '../../../../core/application/useCases/ApplyBankedUseCase';

export class BankingController {
  private bankSurplusUseCase: BankSurplusUseCase;
  private applyBankedUseCase: ApplyBankedUseCase;

  constructor(
    bankSurplusUseCase: BankSurplusUseCase,
    applyBankedUseCase: ApplyBankedUseCase
  ) {
    this.bankSurplusUseCase = bankSurplusUseCase;
    this.applyBankedUseCase = applyBankedUseCase;
  }

  async bankSurplus(req: Request, res: Response): Promise<void> {
    try {
      const { shipId, year, amount } = req.body;

      console.log('📦 Bank Surplus Request:', { shipId, year, amount });

      if (!shipId || !year || amount === undefined) {
        res.status(400).json({ error: 'shipId, year, and amount are required' });
        return;
      }

      const result = await this.bankSurplusUseCase.execute(shipId, year, amount);
      res.json(result);
    } catch (error: any) {
      console.error('❌ Bank Surplus Error:', error.message);
      res.status(400).json({ error: error.message });
    }
  }

  async applyBanked(req: Request, res: Response): Promise<void> {
    try {
      const { shipId, year, amount } = req.body;

      console.log('📦 Apply Banked Request:', { shipId, year, amount });

      if (!shipId || !year || amount === undefined) {
        res.status(400).json({ error: 'shipId, year, and amount are required' });
        return;
      }

      const result = await this.applyBankedUseCase.execute(shipId, year, amount);
      res.json(result);
    } catch (error: any) {
      console.error('❌ Apply Banked Error:', error.message);
      res.status(400).json({ error: error.message });
    }
  }

  async getBankingRecords(req: Request, res: Response): Promise<void> {
    try {
      const { shipId, year } = req.query;

      console.log('📋 Get Banking Records Request:', { shipId, year });

      if (!shipId || !year) {
        res.status(400).json({ error: 'shipId and year are required' });
        return;
      }

      // Access repository through use case
      const bankingRepo = (this.bankSurplusUseCase as any).bankingRepository;
      
      // Get all bank entries
      const bankEntries = await bankingRepo.findByShipAndYear(
        shipId as string,
        parseInt(year as string)
      );

      // Calculate totals
      let totalBanked = 0;
      let totalApplied = 0;

      for (const entry of bankEntries) {
        totalBanked += entry.amountGco2eq;
        if (entry.isApplied) {
          totalApplied += entry.amountGco2eq;
        }
      }

      const availableBanked = totalBanked - totalApplied;

      console.log('💰 Banking Summary:', { 
        totalBanked, 
        totalApplied, 
        availableBanked,
        entriesCount: bankEntries.length 
      });

      res.json({
        shipId,
        year: parseInt(year as string),
        totalBanked,
        totalApplied,
        availableBanked,
        entries: bankEntries.map((entry: { id: any; amountGco2eq: any; isApplied: any; createdAt: any; }) => ({
          id: entry.id,
          amount: entry.amountGco2eq,
          isApplied: entry.isApplied,
          createdAt: entry.createdAt
        }))
      });
    } catch (error: any) {
      console.error('❌ Get Banking Records Error:', error.message);
      res.status(500).json({ error: error.message });
    }
  }
}
