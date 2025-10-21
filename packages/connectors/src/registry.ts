import type { ChainType } from '@allyo/types';

import { BitcoinConnector } from './bitcoin.connector';
import { EvmConnector } from './evm.connector';
import { SolanaConnector } from './solana.connector';
import type { ChainConnector } from './types';

const registry = new Map<ChainType, ChainConnector>();

export function getConnector(chain: ChainType): ChainConnector {
  const existing = registry.get(chain);
  if (existing) {
    return existing;
  }

  const created = createConnector(chain);
  registry.set(chain, created);
  return created;
}

function createConnector(chain: ChainType): ChainConnector {
  switch (chain) {
    case 'ethereum':
    case 'bsc':
      return new EvmConnector(chain);
    case 'solana':
      return new SolanaConnector();
    case 'bitcoin':
      return new BitcoinConnector();
    default:
      throw new Error(`Unsupported chain: ${chain}`);
  }
}

export async function initConnector(chain: ChainType): Promise<ChainConnector> {
  const connector = getConnector(chain);
  await connector.init();
  return connector;
}
