export type ChainType = 'ethereum' | 'bsc' | 'solana' | 'bitcoin';

export type NetworkTier = 'mainnet' | 'testnet';

export interface IdentityClaim {
  sub: string;
  fullName: string;
  snils: string;
  inn?: string;
  passportSeries?: string;
  passportNumber?: string;
  assuranceLevel: 'basic' | 'substantial' | 'high';
}

export interface PolicyDescriptor {
  id: string;
  type:
    | 'timelock'
    | 'spending-limit'
    | 'allowlist'
    | 'multisig'
    | 'pause'
    | 'escrow'
    | 'guardian-recovery';
  params: Record<string, unknown>;
  active: boolean;
}
