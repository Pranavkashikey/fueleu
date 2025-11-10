import { Request, Response } from 'express';
import { CreatePoolUseCase } from '../../../../core/application/useCases/CreatePoolUseCase';

export class PoolingController {
  private createPoolUseCase: CreatePoolUseCase;

  constructor(createPoolUseCase: CreatePoolUseCase) {
    this.createPoolUseCase = createPoolUseCase;
  }

  async createPool(req: Request, res: Response): Promise<void> {
    try {
      const { year, members } = req.body;

      if (!year || !members || !Array.isArray(members)) {
        res.status(400).json({ error: 'year and members array are required' });
        return;
      }

      const result = await this.createPoolUseCase.execute({ year, members });
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
