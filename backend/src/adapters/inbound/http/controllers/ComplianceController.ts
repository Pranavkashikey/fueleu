import { Request, Response } from 'express';
import { GetComplianceBalanceUseCase } from '../../../../core/application/useCases/GetComplianceBalanceUseCase';
import { ComputeComplianceBalanceUseCase } from '../../../../core/application/useCases/ComputeComplianceBalanceUseCase';
import { GetAdjustedCBUseCase } from '../../../../core/application/useCases/GetAdjustedCBUseCase';

export class ComplianceController {
  private getComplianceBalanceUseCase: GetComplianceBalanceUseCase;
  private computeComplianceBalanceUseCase: ComputeComplianceBalanceUseCase;
  private getAdjustedCBUseCase: GetAdjustedCBUseCase;

  constructor(
    getComplianceBalanceUseCase: GetComplianceBalanceUseCase,
    computeComplianceBalanceUseCase: ComputeComplianceBalanceUseCase,
    getAdjustedCBUseCase: GetAdjustedCBUseCase
  ) {
    this.getComplianceBalanceUseCase = getComplianceBalanceUseCase;
    this.computeComplianceBalanceUseCase = computeComplianceBalanceUseCase;
    this.getAdjustedCBUseCase = getAdjustedCBUseCase;
  }

  async getComplianceBalance(req: Request, res: Response): Promise<void> {
    try {
      const { shipId, year } = req.query;

      if (!shipId || !year) {
        res.status(400).json({ error: 'shipId and year are required' });
        return;
      }

      const balance = await this.getComplianceBalanceUseCase.execute(
        shipId as string,
        parseInt(year as string)
      );

      if (!balance) {
        res.status(404).json({ error: 'Compliance balance not found' });
        return;
      }

      res.json(balance);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAdjustedCB(req: Request, res: Response): Promise<void> {
    try {
      const { year } = req.query;

      if (!year) {
        res.status(400).json({ error: 'year is required' });
        return;
      }

     
      const sampleShips = ['SHIP001', 'SHIP002', 'SHIP003'];
      
      const adjustedBalances = await Promise.all(
        sampleShips.map(async (shipId) => {
          const adjusted = await this.getAdjustedCBUseCase.execute(shipId, parseInt(year as string));
          return adjusted ? {
            shipId: adjusted.shipId,
            shipName: `Ship-${shipId}`,
            adjustedCB: adjusted.cbAfter,
            cbBefore: adjusted.cbBefore,
            cbAfter: adjusted.cbAfter
          } : null;
        })
      );

      const filtered = adjustedBalances.filter(b => b !== null);
      res.json(filtered);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
