import type { ChainType } from '@allyo/types';

export type ChainNetwork = 'mainnet' | 'testnet';

export interface BalanceResult {
  confirmed: string;
  pending?: string;
  tokenBalances?: Record<string, string>;
}

export interface TransferIntent {
  from: string;
  to: string;
  amount: string;
  tokenAddress?: string;
  memo?: string;
}

export interface UnsignedPayload {
  type: 'evmTypedData' | 'solanaTransaction' | 'bitcoinPsbt';
  payload: string;
  metadata?: Record<string, unknown>;
}

export interface BroadcastResult {
  txHash: string;
  explorerUrl?: string;
}

export interface ChainConnector {
  readonly chain: ChainType;
  init(): Promise<void>;
  getBalance(address: string): Promise<BalanceResult>;
  validateAddress(address: string): Promise<boolean>;
  buildUnsignedTransfer(intent: TransferIntent): Promise<UnsignedPayload>;
  broadcast(signedPayload: string): Promise<BroadcastResult>;
  getTransaction(txHash: string): Promise<Record<string, unknown> | null>;
}
