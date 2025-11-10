
export interface ComparisonData {
  routeId: string;
  baseline: number;
  comparison: number;
  percentDiff: number;
  compliant: boolean;
}

export const TARGET_INTENSITY = 89.3368; // 2% below 91.16
