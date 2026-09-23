import type { FloorData } from "../data";

/**
 * Who the randomiser may land on next.
 *
 * Rules, in order:
 *
 * 1. It draws **players**, not tiles. Picking a random tile made someone with
 *    five tiles five times as likely to be drawn as someone with one.
 * 2. Players who have already had their turn are skipped. A player "has
 *    played" if any of their tiles says so -- tiles merge as people win, so
 *    the flag is read per person, not per tile.
 * 3. The player who just won (`exclude`) is skipped too: passing your turn
 *    after a win means someone else goes next.
 * 4. Of those left, the ones with the **smallest territory** go first; ties
 *    are broken at random by the caller.
 * 5. When nobody is left, the pool starts over (`resetPool`) instead of the
 *    button silently doing nothing -- everyone except `exclude` is eligible
 *    again.
 */
export type DrawPlan = {
  /** Players the draw may end on: the eligible ones with the fewest tiles. */
  candidates: string[];
  /** Every eligible player, for the spinning animation. */
  eligible: string[];
  /** True when everyone had played and the pool was started over. */
  resetPool: boolean;
};

type PlayerSummary = { person: string; tiles: number; hasPlayed: boolean };

export function summarisePlayers(pieces: FloorData[]): PlayerSummary[] {
  const byPerson = new Map<string, PlayerSummary>();
  for (const piece of pieces) {
    const current = byPerson.get(piece.person) ?? {
      person: piece.person,
      tiles: 0,
      hasPlayed: false,
    };
    current.tiles += 1;
    current.hasPlayed ||= piece.hasPlayed;
    byPerson.set(piece.person, current);
  }
  return [...byPerson.values()];
}

export function planDraw(pieces: FloorData[], exclude?: string): DrawPlan {
  const players = summarisePlayers(pieces);
  const others = players.filter((player) => player.person !== exclude);
  // Only the excluded player is left on the board: nothing else to draw.
  const pool = others.length > 0 ? others : players;

  let eligible = pool.filter((player) => !player.hasPlayed);
  let resetPool = false;
  if (eligible.length === 0) {
    eligible = pool;
    resetPool = true;
  }

  const fewest = Math.min(...eligible.map((player) => player.tiles));
  return {
    candidates: eligible
      .filter((player) => player.tiles === fewest)
      .map((player) => player.person),
    eligible: eligible.map((player) => player.person),
    resetPool,
  };
}

/**
 * The board after `person` has been drawn: they are marked as having played
 * on every tile they own, and if the pool was started over everyone else is
 * marked as not having played.
 */
export function markDrawn(
  pieces: FloorData[],
  person: string,
  resetPool: boolean
): FloorData[] {
  return pieces.map((piece) => ({
    ...piece,
    hasPlayed:
      piece.person === person ? true : resetPool ? false : piece.hasPlayed,
  }));
}

/**
 * Whether the winner of a duel counts as having played.
 *
 * The challenger was drawn (or chose to keep going), so yes. A defender who
 * won was never drawn -- marking them would take them out of the draw for
 * good, which is what used to happen. They keep whatever they had before.
 */
export function winnerHasPlayed(
  pieces: FloorData[],
  winner: string,
  challenger: string
): boolean {
  if (winner === challenger) return true;
  return summarisePlayers(pieces).some(
    (player) => player.person === winner && player.hasPlayed
  );
}
