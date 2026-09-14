// Azulejos gerados de forma determinística a partir de uma string (slug, nome).
// A mesma seed sempre produz o mesmo desenho, então cada post tem um "carimbo" fixo.

export type TileColor = 'blue' | 'yellow' | 'green' | 'red' | 'paper';

export interface TileSpec {
  pattern: number;
  rotation: number;
  ground: TileColor;
  figure: TileColor;
  detail: TileColor;
}

export const TILE_PATTERNS = 6;

function hash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// mulberry32: PRNG pequeno e estável entre builds.
function random(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const ACCENTS: TileColor[] = ['yellow', 'green', 'red'];

export function makeTiles(seed: string, count: number): TileSpec[] {
  const next = random(hash(seed));
  const pick = <T,>(items: T[]) => items[Math.floor(next() * items.length)];

  return Array.from({ length: count }, () => {
    // Base azul e branco, como nos painéis de Brasília, com uma cor de acento às vezes.
    const blueGround = next() < 0.5;
    const ground: TileColor = blueGround ? 'blue' : 'paper';
    const figure: TileColor = next() < 0.3 ? pick(ACCENTS) : blueGround ? 'paper' : 'blue';
    const detail: TileColor = next() < 0.5 ? pick(ACCENTS) : blueGround ? 'paper' : 'blue';
    return {
      pattern: Math.floor(next() * TILE_PATTERNS),
      rotation: Math.floor(next() * 4) * 90,
      ground,
      figure,
      detail,
    };
  });
}
