import { sum } from './index';

describe('sum', () => {
  it('should add two positive numbers', () => {
    expect(sum(2, 3)).toBe(5);
  });

  it('should add negative numbers', () => {
    expect(sum(-1, -1)).toBe(-2);
  });

  it('should handle zero', () => {
    expect(sum(0, 5)).toBe(5);
  });

  it('should handle large numbers', () => {
    expect(sum(1_000_000, 2_000_000)).toBe(3_000_000);
  });
});
