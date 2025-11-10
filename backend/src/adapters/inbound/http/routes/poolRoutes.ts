import { Router } from 'express';
import { PoolingController } from '../controllers/PoolingController';

export function createPoolRoutes(controller: PoolingController): Router {
  const router = Router();

  router.post('/', (req, res) => controller.createPool(req, res));

  return router;
}
