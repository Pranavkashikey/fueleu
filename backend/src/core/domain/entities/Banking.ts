export interface BankEntry {
  id: number;
  shipId: string;
  year: number;
  amountGco2eq: number;
  isApplied: boolean;
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
  cbBefore: number;
  applied: number;
  cbAfter: number;
}
