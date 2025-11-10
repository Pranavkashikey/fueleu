export interface Pool {
  id: number;
  year: number;
  createdAt: Date;
  members: PoolMember[];
}

export interface PoolMember {
  id: number;
  poolId: number;
  shipId: string;
  shipName: string;
  cbBefore: number;
  cbAfter: number;
}

export interface CreatePoolRequest {
  year: number;
  members: string[];  // Array of shipIds
}

export interface PoolValidationResult {
  isValid: boolean;
  poolSum: number;
  errors: string[];
}

export interface PoolAllocation {
  shipId: string;
  shipName: string;
  cbBefore: number;
  cbAfter: number;
  allocated: number;
}
