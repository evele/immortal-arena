export class SeededRng {
  private state: number;

  constructor(seed: number) {
    const normalized = Number.isFinite(seed) ? seed >>> 0 : 0;
    this.state = normalized === 0 ? 0x6d2b79f5 : normalized;
  }

  nextFloat(): number {
    this.state = (this.state + 0x6d2b79f5) | 0;
    let t = Math.imul(this.state ^ (this.state >>> 15), 1 | this.state);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  nextInt(minInclusive: number, maxInclusive: number): number {
    if (maxInclusive < minInclusive) {
      throw new Error(`Invalid nextInt range ${minInclusive}..${maxInclusive}`);
    }

    const span = maxInclusive - minInclusive + 1;
    return minInclusive + Math.floor(this.nextFloat() * span);
  }
}
