/**
 * How to lay out the floor for a given number of players.
 *
 * The board should always be as close to a clean rectangle as possible:
 * 21 players -> 7x3, 24 -> 6x4, 25 -> 5x5. When the count doesn't factor
 * nicely (22, 23, primes) a couple of empty squares at the end beat a 11x2
 * strip, so each layout is scored on two things:
 *
 * - shape: distance from a gently landscape board (cols/rows = 4/3), measured
 *   as |ln(ratio)| so 2x too wide and 2x too tall count the same;
 * - waste: every empty square costs a little, so an exact fit wins unless it
 *   is badly stretched.
 *
 * Columns are always >= rows, because the projector is landscape.
 */
const TARGET_RATIO = 4 / 3;
const EMPTY_CELL_PENALTY = 0.2;

export type BoardLayout = { cols: number; rows: number };

export function boardLayout(count: number): BoardLayout {
  if (count <= 1) return { cols: 1, rows: 1 };

  let best: BoardLayout = { cols: count, rows: 1 };
  let bestScore = Infinity;

  for (let cols = Math.ceil(Math.sqrt(count)); cols <= count; cols += 1) {
    const rows = Math.ceil(count / cols);
    // A layout whose last row would be completely empty is just a worse
    // version of a smaller one.
    if ((rows - 1) * cols >= count) continue;

    const empty = cols * rows - count;
    const score =
      Math.abs(Math.log(cols / rows / TARGET_RATIO)) + EMPTY_CELL_PENALTY * empty;

    if (score < bestScore - 1e-9) {
      best = { cols, rows };
      bestScore = score;
    }
  }

  return best;
}

/** Indices directly above, below, left and right of `index` on the board. */
export function neighbourIndices(
  index: number,
  count: number,
  cols: number
): number[] {
  if (index < 0 || index >= count) return [];

  const neighbours: number[] = [];
  if (index - cols >= 0) neighbours.push(index - cols);
  if (index + cols < count) neighbours.push(index + cols);
  if (index % cols !== 0) neighbours.push(index - 1);
  if (index % cols !== cols - 1 && index + 1 < count) neighbours.push(index + 1);
  return neighbours;
}
