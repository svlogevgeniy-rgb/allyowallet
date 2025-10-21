import { Psbt, networks, payments } from 'bitcoinjs-lib';

import type {
  BalanceResult,
  BroadcastResult,
  ChainConnector,
  TransferIntent,
  UnsignedPayload
} from './types';

export class BitcoinConnector implements ChainConnector {
  readonly chain = 'bitcoin';
  private network = networks.testnet;

  async init(): Promise<void> {
    const networkName = process.env.BITCOIN_NETWORK ?? 'testnet';
    this.network = networkName === 'mainnet' ? networks.bitcoin : networks.testnet;
  }

  async getBalance(address: string): Promise<BalanceResult> {
    // Placeholder: integrate with bitcoind RPC or indexer
    return { confirmed: '0', pending: '0' };
  }

  async validateAddress(address: string): Promise<boolean> {
    try {
      payments.p2wpkh({ address, network: this.network });
      return true;
    } catch (error) {
      return false;
    }
  }

  async buildUnsignedTransfer(intent: TransferIntent): Promise<UnsignedPayload> {
    const psbt = new Psbt({ network: this.network });
    // Inputs/outputs should be filled by UTXO fetcher (to be implemented in backend service)
    // Provide placeholder metadata for Android to sign.
    return {
      type: 'bitcoinPsbt',
      payload: psbt.toBase64(),
      metadata: {
        note: 'Fill inputs/outputs before signing'
      }
    };
  }

  async broadcast(_signedPayload: string): Promise<BroadcastResult> {
    // Integrate with bitcoind RPC in later iteration
    return { txHash: 'pending-broadcast' };
  }

  async getTransaction(_txHash: string): Promise<Record<string, unknown> | null> {
    return null;
  }
}
