import { JsonRpcProvider, Wallet, formatEther, parseEther, isAddress } from 'ethers';

import type { ChainConnector, BalanceResult, TransferIntent, UnsignedPayload, BroadcastResult } from './types';

const DEFAULT_GAS_LIMIT = 120000n;

export class EvmConnector implements ChainConnector {
  readonly chain;
  private provider: JsonRpcProvider | null = null;
  private relayer: Wallet | null = null;

  constructor(chain: 'ethereum' | 'bsc') {
    this.chain = chain;
  }

  async init(): Promise<void> {
    if (this.provider) {
      return;
    }
    const envKey = this.chain === 'ethereum' ? 'ETHEREUM_RPC_URL' : 'BSC_RPC_URL';
    const rpcUrl = process.env[envKey];
    if (!rpcUrl) {
      throw new Error(`Missing RPC URL for ${this.chain}`);
    }
    this.provider = new JsonRpcProvider(rpcUrl);

    const relayerKey = process.env.EVM_RELAYER_KEY;
    this.relayer = relayerKey ? new Wallet(relayerKey, this.provider) : null;
  }

  private assertProvider(): JsonRpcProvider {
    if (!this.provider) {
      throw new Error('EVM provider not initialized');
    }
    return this.provider;
  }

  async getBalance(address: string): Promise<BalanceResult> {
    const provider = this.assertProvider();
    const balance = await provider.getBalance(address);
    return { confirmed: formatEther(balance) };
  }

  async validateAddress(address: string): Promise<boolean> {
    return isAddress(address);
  }

  async buildUnsignedTransfer(intent: TransferIntent): Promise<UnsignedPayload> {
    const provider = this.assertProvider();
    const nonce = await provider.getTransactionCount(intent.from);
    const gasPrice = await provider.getFeeData();
    const tx = {
      to: intent.to,
      value: parseEther(intent.amount).toString(),
      nonce,
      gasLimit: DEFAULT_GAS_LIMIT.toString(),
      maxFeePerGas: gasPrice.maxFeePerGas?.toString(),
      maxPriorityFeePerGas: gasPrice.maxPriorityFeePerGas?.toString(),
      chainId: (await provider.getNetwork()).chainId.toString()
    };

    return {
      type: 'evmTypedData',
      payload: JSON.stringify(tx)
    };
  }

  async broadcast(signedPayload: string): Promise<BroadcastResult> {
    const provider = this.assertProvider();
    const parsed = JSON.parse(signedPayload) as { raw: string };
    const txResponse = await provider.sendTransaction(parsed.raw);
    const receipt = await txResponse.wait();
    return { txHash: receipt?.hash ?? txResponse.hash };
  }

  async getTransaction(txHash: string): Promise<Record<string, unknown> | null> {
    const provider = this.assertProvider();
    const tx = await provider.getTransaction(txHash);
    if (!tx) {
      return null;
    }
    return tx;
  }
}
