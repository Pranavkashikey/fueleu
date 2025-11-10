import type { IRouteRepository } from '../ports/outbound/IRouteRepository';
import type { ComparisonResult } from '../../domain/entities/Route';
import { TARGET_INTENSITY_2025 } from '../../../shared/constants';

export class GetComparisonUseCase {
  private routeRepository: IRouteRepository;

  constructor(routeRepository: IRouteRepository) {
    this.routeRepository = routeRepository;
  }

  async execute(): Promise<ComparisonResult[]> {
    const baseline = await this.routeRepository.findBaseline();
    
    if (!baseline) {
      throw new Error('No baseline route set');
    }

    const allRoutes = await this.routeRepository.findAll();
    const comparisonRoutes = allRoutes.filter(r => !r.isBaseline);

    return comparisonRoutes.map(route => {
      const percentDiff = ((route.ghgIntensity / baseline.ghgIntensity) - 1) * 100;
      const compliant = route.ghgIntensity <= TARGET_INTENSITY_2025;

      return {
        routeId: route.routeId,
        baseline: baseline.ghgIntensity,
        comparison: route.ghgIntensity,
        percentDiff,
        compliant
      };
    });
  }
}
