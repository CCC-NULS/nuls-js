export const NULS_DECIMALS: number = 8;
export const NULS_BASE: number = Math.pow(10, 8);

export function nulsToNa(nuls: number): number {
  return nuls * NULS_BASE;
}

export function naToNuls(na: number): number {
  return na / NULS_BASE;
}