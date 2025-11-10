export interface ComplianceBalance {
  id: number;
  shipId: string;
  year: number;
  cbGco2eq: number;
  createdAt: Date;
}

export interface BankingRequest {
  shipId: string;
  year: number;
  amount: number;
}

export interface BankingResponse {
  success: boolean;
  shipId: string;
  year: number;
  cb_before: number;
  applied: number;
  cb_after: number;
}
