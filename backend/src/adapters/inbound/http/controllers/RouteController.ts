import { Request, Response } from 'express';
import { GetRoutesUseCase } from '../../../../core/application/useCases/GetRoutesUseCase';
import { SetBaselineUseCase } from '../../../../core/application/useCases/SetBaselineUseCase';
import { GetComparisonUseCase } from '../../../../core/application/useCases/GetComparisonUseCase';

export class RouteController {
  private getRoutesUseCase: GetRoutesUseCase;
  private setBaselineUseCase: SetBaselineUseCase;
  private getComparisonUseCase: GetComparisonUseCase;

  constructor(
    getRoutesUseCase: GetRoutesUseCase,
    setBaselineUseCase: SetBaselineUseCase,
    getComparisonUseCase: GetComparisonUseCase
  ) {
    this.getRoutesUseCase = getRoutesUseCase;
    this.setBaselineUseCase = setBaselineUseCase;
    this.getComparisonUseCase = getComparisonUseCase;
  }

  async getRoutes(req: Request, res: Response): Promise<void> {
    try {
      const { year, vesselType, fuelType } = req.query;

      const filters = {
        year: year ? parseInt(year as string) : undefined,
        vesselType: vesselType as string | undefined,
        fuelType: fuelType as string | undefined
      };

      const routes = await this.getRoutesUseCase.execute(filters);
      res.json(routes);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async setBaseline(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const route = await this.setBaselineUseCase.execute(id);
      res.json(route);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getComparison(req: Request, res: Response): Promise<void> {
    try {
      const comparison = await this.getComparisonUseCase.execute();
      res.json(comparison);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
