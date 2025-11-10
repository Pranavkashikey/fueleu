export interface ComplianceBalance {
  id: number;
  shipId: string;
  year: number;
  cbGco2eq: number;  
  createdAt: Date;
}

export interface ComplianceCalculation {
  shipId: string;
  year: number;
  targetIntensity: number;
  actualIntensity: number;
  energyInScope: number;
  complianceBalance: number;
}

export interface AdjustedComplianceBalance {
  shipId: string;
  year: number;
  cbBefore: number;
  bankedApplied: number;
  cbAfter: number;
}
