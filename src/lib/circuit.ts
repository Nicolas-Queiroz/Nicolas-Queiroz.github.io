// Peças de circuito geradas de forma determinística a partir de uma string.
// A mesma seed sempre produz o mesmo desenho: o carimbo e a capa de um post
// nunca mudam entre builds, e PT/EN compartilham a seed (a URL da fonte).
//
// Cada peça guarda uma máscara de conexões no desenho base (N=1, E=2, S=4, W=8)
// e uma rotação em graus. O circuito é uma árvore geradora da grade, então
// sempre existe uma orientação em que tudo se liga ao nó "source" (o agente).

export const N = 1;
export const E = 2;
export const S = 4;
export const W = 8;

const DIRS = [
  { bit: N, dx: 0, dy: -1, opposite: S },
  { bit: E, dx: 1, dy: 0, opposite: W },
  { bit: S, dx: 0, dy: 1, opposite: N },
  { bit: W, dx: -1, dy: 0, opposite: E },
];

export type PieceNode = 'none' | 'via' | 'chip' | 'neuron' | 'source';

export interface Piece {
  mask: number;
  rotation: number;
  node: PieceNode;
  live: boolean;
}

interface CircuitOptions {
  // Gira peças fora das rotas acesas e recalcula o que segue ligado ao agente (puzzle).
  scramble?: boolean;
  // Quantas rotas do agente até uma folha ficam acesas (capas e carimbos).
  routes?: number;
  // Fração máxima da grade acesa pelas rotas, para a capa não virar um bloco só.
  maxLive?: number;
  // Chance de cada peça começar girada no puzzle.
  scrambleRate?: number;
}

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

// Rotação horária em quartos de volta: N vira E, E vira S, e assim por diante.
export function rotateMask(mask: number, quarters: number): number {
  let m = mask;
  for (let i = 0; i < ((quarters % 4) + 4) % 4; i++) {
    m = ((m << 1) | (m >> 3)) & 15;
  }
  return m;
}

// Índices das peças ligadas ao agente considerando a rotação atual.
// O script do TileWall faz a mesma busca no navegador.
export function connectedToSource(pieces: Piece[], cols: number): Set<number> {
  const rows = pieces.length / cols;
  const masks = pieces.map((p) => rotateMask(p.mask, p.rotation / 90));
  const source = pieces.findIndex((p) => p.node === 'source');
  const seen = new Set([source]);
  const stack = [source];
  while (stack.length) {
    const i = stack.pop()!;
    const x = i % cols;
    const y = Math.floor(i / cols);
    for (const d of DIRS) {
      const nx = x + d.dx;
      const ny = y + d.dy;
      if (!(masks[i] & d.bit) || nx < 0 || nx >= cols || ny < 0 || ny >= rows) continue;
      const j = ny * cols + nx;
      if (seen.has(j) || !(masks[j] & d.opposite)) continue;
      seen.add(j);
      stack.push(j);
    }
  }
  return seen;
}

export function makeCircuit(seed: string, cols: number, rows: number, options: CircuitOptions = {}): Piece[] {
  const next = random(hash(seed));
  const pick = <T,>(items: T[]) => items[Math.floor(next() * items.length)];
  const total = cols * rows;

  // Árvore geradora por backtracking: corredores longos lembram trilhas de placa.
  const masks = new Array<number>(total).fill(0);
  const parent = new Array<number>(total).fill(-1);
  const start = Math.floor(next() * total);
  const visited = new Set([start]);
  const stack = [start];
  while (stack.length) {
    const i = stack[stack.length - 1];
    const x = i % cols;
    const y = Math.floor(i / cols);
    const open = DIRS.filter((d) => {
      const nx = x + d.dx;
      const ny = y + d.dy;
      return nx >= 0 && nx < cols && ny >= 0 && ny < rows && !visited.has(ny * cols + nx);
    });
    if (open.length === 0) {
      stack.pop();
      continue;
    }
    const d = pick(open);
    const j = (y + d.dy) * cols + (x + d.dx);
    masks[i] |= d.bit;
    masks[j] |= d.opposite;
    parent[j] = i;
    visited.add(j);
    stack.push(j);
  }

  const isLeaf = (i: number) => [N, E, S, W].includes(masks[i]);

  const pieces: Piece[] = masks.map((mask, i) => ({
    mask,
    rotation: 0,
    node: i === start ? 'source' : isLeaf(i) ? pick<PieceNode>(['chip', 'chip', 'neuron', 'via']) : next() < 0.12 ? 'via' : 'none',
    live: i === start,
  }));

  if (options.routes) {
    const cap = Math.max(2, Math.round(total * (options.maxLive ?? 1)));
    const leaves = pieces.map((_, i) => i).filter((i) => i !== start && isLeaf(i));
    const pathTo = (leaf: number) => {
      const path: number[] = [];
      for (let j = leaf; j !== -1 && !pieces[j].live; j = parent[j]) path.push(j);
      return path;
    };
    const shortest = leaves.reduce((best, i) => (pathTo(i).length < pathTo(best).length ? i : best), leaves[0]);
    let lit = 1;
    let routes = 0;
    while (routes < options.routes && leaves.length) {
      const path = pathTo(leaves.splice(Math.floor(next() * leaves.length), 1)[0]);
      // Rota longa demais estoura o limite: tenta outra folha.
      if (lit + path.length > cap) continue;
      path.forEach((j) => (pieces[j].live = true));
      lit += path.length;
      routes++;
    }
    // Nenhuma rota coube: acende pelo menos o caminho mais curto.
    if (routes === 0 && shortest !== undefined) pathTo(shortest).forEach((j) => (pieces[j].live = true));
  }

  if (options.scramble) {
    for (const piece of pieces) {
      // Rotas já acesas ficam no lugar: o puzzle começa com parte do circuito ligada.
      if (piece.live) continue;
      if (next() < (options.scrambleRate ?? 0.5)) piece.rotation = (1 + Math.floor(next() * 3)) * 90;
    }
    let connected = connectedToSource(pieces, cols);
    if (connected.size === total) {
      // Já nasceu resolvido: gira uma folha, que sempre desconecta.
      const leaf = pieces.findIndex((_, i) => i !== start && isLeaf(i));
      pieces[leaf].rotation += 90;
      connected = connectedToSource(pieces, cols);
    }
    pieces.forEach((piece, i) => (piece.live = connected.has(i)));
  }

  return pieces;
}
