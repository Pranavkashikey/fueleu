import { Router } from 'express';
import { RouteController } from '../controllers/RouteController';

export function createRouteRoutes(controller: RouteController): Router {
  const router = Router();

  router.get('/', (req, res) => controller.getRoutes(req, res));
  router.post('/:id/baseline', (req, res) => controller.setBaseline(req, res));
  router.get('/comparison', (req, res) => controller.getComparison(req, res));

  return router;
}
