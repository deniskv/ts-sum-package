import { sum } from '../dist/index';

describe('E2E: package integration', () => {
  it('should work when imported from the built artifact', () => {
    expect(sum(10, 20)).toBe(30);
  });

  it('should handle a multi-step calculation', () => {
    const a = sum(1, 2);
    const b = sum(a, 3);
    const c = sum(b, 4);
    expect(c).toBe(10);
  });
});
