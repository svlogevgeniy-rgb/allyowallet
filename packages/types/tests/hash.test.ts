import { describe, expect, it } from 'vitest';

import { hashPayload } from '../src/utils';

describe('hashPayload', () => {
  it('produces deterministic hashes', () => {
    const first = hashPayload({ foo: 'bar' });
    const second = hashPayload({ foo: 'bar' });
    expect(first).toBe(second);
  });
});
