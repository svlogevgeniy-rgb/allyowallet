import crypto from 'node:crypto';

export interface HashChainEntry {
  prevHash: string | null;
  payload: unknown;
  timestamp: string;
}

export interface HashChainRecord extends HashChainEntry {
  hash: string;
}

export function hashPayload(payload: unknown): string {
  const serialized = typeof payload === 'string' ? payload : JSON.stringify(payload);
  return crypto.createHash('sha3-256').update(serialized).digest('hex');
}

export function computeEntryHash(entry: HashChainEntry): string {
  const base = `${entry.prevHash ?? ''}|${entry.timestamp}|${hashPayload(entry.payload)}`;
  return crypto.createHash('sha3-256').update(base).digest('hex');
}

export function buildRecord(entry: HashChainEntry): HashChainRecord {
  return { ...entry, hash: computeEntryHash(entry) };
}
