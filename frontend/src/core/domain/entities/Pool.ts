

export interface PoolMember {
  shipId: string;
  shipName: string;
  adjustedCB: number;
  cbBefore: number;
  cbAfter: number;
}

export interface Pool {
  poolId?: string;
  members: PoolMember[];
  poolSum: number;
  isValid: boolean;
}
export interface PoolAllocation {
  shipId: string;
  shipName: string;
  cbBefore: number;
  cbAfter: number;
  allocated: number;
}
export interface CreatePoolRequest {
  members: string[];  // Array of shipIds
  year: number;
}

export interface CreatePoolResponse {
  poolId: number;
  allocations: PoolAllocation[];
}

export interface CreatePoolResult {
  success: boolean;
  data?: CreatePoolResponse;
  error?: string;
}

