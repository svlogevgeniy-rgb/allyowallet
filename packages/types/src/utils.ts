import crypto from 'node:crypto';

export const HASH_ALGO = 'sha3-256';

export function hashPayload(payload: unknown): string {
  const json = typeof payload === 'string' ? payload : JSON.stringify(payload);
  return crypto.createHash(HASH_ALGO).update(json).digest('hex');
}

export function assertNever(x: never): never {
  throw new Error(`Unexpected value: ${JSON.stringify(x)}`);
}
