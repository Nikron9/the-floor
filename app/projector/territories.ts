/**
 * Territories: the board as players own it, rather than as tiles.
 *
 * When someone wins a duel they take the loser's tiles, so a player ends up
 * owning a connected block of tiles. The projector draws each block as one
 * shape -- no borders or gaps between tiles of the same owner -- with the
 * owner's name placed once, inside the largest rectangle the block contains,
 * so the label can never spill outside the shape however irregular it gets.
 *
 * Everything here is pure geometry on the grid; the component supplies pixel
 * sizes.
 */

export type Territory = {
  /** Stable key: the lowest tile index in the block. */
  id: number;
  person: string;
  /** Tile indices, ascending. */
  cells: number[];
  /** Largest all-owned rectangle, in grid cells, for the label. */
  label: { col: number; row: number; cols: number; rows: number };
};

type Owned = { person: string };

/** Connected blocks of tiles owned by the same person (4-neighbourhood). */
export function findTerritories(
  pieces: readonly Owned[],
  cols: number
): Territory[] {
  const seen = new Set<number>();
  const territories: Territory[] = [];

  for (let start = 0; start < pieces.length; start += 1) {
    if (seen.has(start)) continue;
    const person = pieces[start].person;
    const cells: number[] = [];
    const queue = [start];
    seen.add(start);

    while (queue.length > 0) {
      const index = queue.pop()!;
      cells.push(index);
      for (const next of neighbours(index, pieces.length, cols)) {
        if (!seen.has(next) && pieces[next].person === person) {
          seen.add(next);
          queue.push(next);
        }
      }
    }

    cells.sort((a, b) => a - b);
    territories.push({
      id: cells[0],
      person,
      cells,
      label: largestRectangle(cells, cols),
    });
  }

  return territories;
}

function neighbours(index: number, count: number, cols: number): number[] {
  const result: number[] = [];
  if (index - cols >= 0) result.push(index - cols);
  if (index + cols < count) result.push(index + cols);
  if (index % cols !== 0) result.push(index - 1);
  if (index % cols !== cols - 1 && index + 1 < count) result.push(index + 1);
  return result;
}

/**
 * The biggest rectangle made only of `cells`. Ties go to the one nearest the
 * block's centre, then to the wider one (names are read left to right).
 * Blocks are at most a few dozen tiles, so trying every rectangle is fine.
 */
export function largestRectangle(
  cells: readonly number[],
  cols: number
): Territory["label"] {
  const owned = new Set(cells);
  const at = (col: number, row: number) => owned.has(row * cols + col);

  const positions = cells.map((index) => ({
    col: index % cols,
    row: Math.floor(index / cols),
  }));
  const minCol = Math.min(...positions.map((p) => p.col));
  const maxCol = Math.max(...positions.map((p) => p.col));
  const minRow = Math.min(...positions.map((p) => p.row));
  const maxRow = Math.max(...positions.map((p) => p.row));
  const centreCol = positions.reduce((sum, p) => sum + p.col + 0.5, 0) / positions.length;
  const centreRow = positions.reduce((sum, p) => sum + p.row + 0.5, 0) / positions.length;

  let best = { col: positions[0].col, row: positions[0].row, cols: 1, rows: 1 };
  let bestScore = [-Infinity, -Infinity, -Infinity];

  for (let top = minRow; top <= maxRow; top += 1) {
    for (let left = minCol; left <= maxCol; left += 1) {
      if (!at(left, top)) continue;
      // Grow down row by row, keeping the widest run that fits every row.
      let width = Infinity;
      for (let bottom = top; bottom <= maxRow && at(left, bottom); bottom += 1) {
        let run = 0;
        while (left + run <= maxCol && run < width && at(left + run, bottom)) run += 1;
        width = run;

        for (let w = 1; w <= width; w += 1) {
          const h = bottom - top + 1;
          const dx = left + w / 2 - centreCol;
          const dy = top + h / 2 - centreRow;
          const score = [w * h, -(dx * dx + dy * dy), w];
          if (compare(score, bestScore) > 0) {
            bestScore = score;
            best = { col: left, row: top, cols: w, rows: h };
          }
        }
      }
    }
  }

  return best;
}

const compare = (a: number[], b: number[]) => {
  for (let i = 0; i < a.length; i += 1) {
    if (Math.abs(a[i] - b[i]) > 1e-9) return a[i] - b[i];
  }
  return 0;
};

export type Geometry = {
  cols: number;
  rows: number;
  cellWidth: number;
  cellHeight: number;
  gapX: number;
  gapY: number;
};

/**
 * SVG path outlining a territory, with rounded corners.
 *
 * The board is split into "atoms": every tile, every gap strip between two
 * tiles, and every little square where four gaps meet. A gap strip belongs to
 * the territory when the tiles on both sides do, a crossing square when all
 * four surrounding tiles do. The outline is the boundary of the owned atoms,
 * which gives clean concave corners on L-shaped blocks and holes where a
 * block surrounds someone else.
 */
export function territoryPath(
  cells: readonly number[],
  geometry: Geometry,
  radius: number
): string {
  const { cols, rows } = geometry;
  const owned = new Set(cells);
  const own = (col: number, row: number) =>
    col >= 0 && row >= 0 && col < cols && row < rows && owned.has(row * cols + col);

  // Atom (ax, ay): even = tile column/row, odd = the gap after it.
  const atomCols = cols * 2 - 1;
  const atomRows = rows * 2 - 1;
  const inside = (ax: number, ay: number): boolean => {
    if (ax < 0 || ay < 0 || ax >= atomCols || ay >= atomRows) return false;
    const c = ax >> 1;
    const r = ay >> 1;
    const gapX = ax % 2 === 1;
    const gapY = ay % 2 === 1;
    if (!gapX && !gapY) return own(c, r);
    if (gapX && !gapY) return own(c, r) && own(c + 1, r);
    if (!gapX && gapY) return own(c, r) && own(c, r + 1);
    return own(c, r) && own(c + 1, r) && own(c, r + 1) && own(c + 1, r + 1);
  };

  // Lattice coordinate -> pixels. Lattice x = atom boundary index.
  const px = (lx: number) =>
    Math.floor(lx / 2) * (geometry.cellWidth + geometry.gapX) +
    (lx % 2 === 1 ? geometry.cellWidth : 0);
  const py = (ly: number) =>
    Math.floor(ly / 2) * (geometry.cellHeight + geometry.gapY) +
    (ly % 2 === 1 ? geometry.cellHeight : 0);

  // Directed boundary edges, clockwise around the owned region (y down).
  const key = (x: number, y: number) => `${x},${y}`;
  const edges = new Map<string, Array<[number, number]>>();
  const add = (x1: number, y1: number, x2: number, y2: number) => {
    const list = edges.get(key(x1, y1)) ?? [];
    list.push([x2, y2]);
    edges.set(key(x1, y1), list);
  };

  for (let ay = 0; ay < atomRows; ay += 1) {
    for (let ax = 0; ax < atomCols; ax += 1) {
      if (!inside(ax, ay)) continue;
      if (!inside(ax, ay - 1)) add(ax, ay, ax + 1, ay); // top: left -> right
      if (!inside(ax + 1, ay)) add(ax + 1, ay, ax + 1, ay + 1); // right: down
      if (!inside(ax, ay + 1)) add(ax + 1, ay + 1, ax, ay + 1); // bottom: right -> left
      if (!inside(ax - 1, ay)) add(ax, ay + 1, ax, ay); // left: up
    }
  }

  const parts: string[] = [];
  while (edges.size > 0) {
    // Walk one loop.
    const [startKey] = edges.keys();
    const loop: Array<[number, number]> = [];
    let [x, y] = startKey.split(",").map(Number);
    for (;;) {
      const k = key(x, y);
      const list = edges.get(k);
      if (!list || list.length === 0) break;
      const [nx, ny] = list.shift()!;
      if (list.length === 0) edges.delete(k);
      loop.push([x, y]);
      x = nx;
      y = ny;
    }

    // Keep only the corners.
    const corners = loop.filter((point, i) => {
      const prev = loop[(i - 1 + loop.length) % loop.length];
      const next = loop[(i + 1) % loop.length];
      const collinear =
        (prev[0] === point[0] && point[0] === next[0]) ||
        (prev[1] === point[1] && point[1] === next[1]);
      return !collinear;
    });
    parts.push(roundedLoop(corners.map(([lx, ly]) => [px(lx), py(ly)]), radius));
  }

  return parts.join(" ");
}

/** A closed polygon with each corner replaced by a quarter-ish curve. */
function roundedLoop(points: Array<[number, number]>, radius: number): string {
  const n = points.length;
  const round = (v: number) => Math.round(v * 100) / 100;
  const segments: string[] = [];

  for (let i = 0; i < n; i += 1) {
    const prev = points[(i - 1 + n) % n];
    const point = points[i];
    const next = points[(i + 1) % n];

    const inLength = Math.hypot(point[0] - prev[0], point[1] - prev[1]);
    const outLength = Math.hypot(next[0] - point[0], next[1] - point[1]);
    const r = Math.min(radius, inLength / 2, outLength / 2);

    const from: [number, number] = [
      point[0] - ((point[0] - prev[0]) / inLength) * r,
      point[1] - ((point[1] - prev[1]) / inLength) * r,
    ];
    const to: [number, number] = [
      point[0] + ((next[0] - point[0]) / outLength) * r,
      point[1] + ((next[1] - point[1]) / outLength) * r,
    ];

    segments.push(
      `${i === 0 ? "M" : "L"}${round(from[0])} ${round(from[1])}`,
      `Q${round(point[0])} ${round(point[1])} ${round(to[0])} ${round(to[1])}`
    );
  }

  return segments.join(" ") + " Z";
}
