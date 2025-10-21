import { describe, expect, it } from 'vitest';

import { buildRecord } from '../src/hash-chain';

describe('hash chain', () => {
  it('produces deterministic hash entries', () => {
    const first = buildRecord({ prevHash: null, payload: { foo: 'bar' }, timestamp: '2024-01-01T00:00:00Z' });
    const second = buildRecord({ prevHash: null, payload: { foo: 'bar' }, timestamp: '2024-01-01T00:00:00Z' });
    expect(first.hash).toBe(second.hash);
  });
});
