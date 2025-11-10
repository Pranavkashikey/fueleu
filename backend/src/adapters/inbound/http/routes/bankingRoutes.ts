import { Router } from 'express';
import { BankingController } from '../controllers/BankingController';

export function createBankingRoutes(controller: BankingController): Router {
  const router = Router();

  router.post('/bank', (req, res) => controller.bankSurplus(req, res));
  router.post('/apply', (req, res) => controller.applyBanked(req, res));

  return router;
}
