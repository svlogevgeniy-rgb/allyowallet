import { Connection, PublicKey } from '@solana/web3.js';

import type {
  BalanceResult,
  BroadcastResult,
  ChainConnector,
  TransferIntent,
  UnsignedPayload
} from './types';

export class SolanaConnector implements ChainConnector {
  readonly chain = 'solana';
  private connection: Connection | null = null;

  async init(): Promise<void> {
    if (this.connection) {
      return;
    }
    const endpoint = process.env.SOLANA_RPC_URL;
    if (!endpoint) {
      throw new Error('Missing SOLANA_RPC_URL');
    }
    this.connection = new Connection(endpoint, 'confirmed');
  }

  private assertConnection(): Connection {
    if (!this.connection) {
      throw new Error('Solana connection not initialized');
    }
    return this.connection;
  }

  async getBalance(address: string): Promise<BalanceResult> {
    const connection = this.assertConnection();
    const lamports = await connection.getBalance(new PublicKey(address));
    return { confirmed: (lamports / 1_000_000_000).toFixed(9) };
  }

  async validateAddress(address: string): Promise<boolean> {
    try {
      new PublicKey(address);
      return true;
    } catch (error) {
      return false;
    }
  }

  async buildUnsignedTransfer(intent: TransferIntent): Promise<UnsignedPayload> {
    const connection = this.assertConnection();
    const recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    const payload = {
      from: intent.from,
      to: intent.to,
      lamports: Math.round(Number(intent.amount) * 1_000_000_000),
      recentBlockhash
    };
    return {
      type: 'solanaTransaction',
      payload: JSON.stringify(payload)
    };
  }

  async broadcast(signedPayload: string): Promise<BroadcastResult> {
    const connection = this.assertConnection();
    const txId = await connection.sendRawTransaction(Buffer.from(signedPayload, 'base64'), {
      skipPreflight: false
    });
    return { txHash: txId };
  }

  async getTransaction(txHash: string): Promise<Record<string, unknown> | null> {
    const connection = this.assertConnection();
    const tx = await connection.getTransaction(txHash, { commitment: 'confirmed' });
    if (!tx) {
      return null;
    }
    return tx as unknown as Record<string, unknown>;
  }
}
