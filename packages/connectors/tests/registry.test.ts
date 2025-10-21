import { describe, expect, it } from 'vitest';

import { getConnector } from '../src/registry';

describe('connector registry', () => {
  it('provides memoized connectors', () => {
    const first = getConnector('bitcoin');
    const second = getConnector('bitcoin');
    expect(first).toBe(second);
  });
});
