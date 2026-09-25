"use client";

import classNames from "classnames";
import { useLayoutEffect, useMemo, useRef, useState } from "react";

import type { FloorData } from "../data";
import type { BoardLayout } from "./boardLayout";
import { findTerritories, territoryPath, type Geometry } from "./territories";

/**
 * The floor, drawn by territory.
 *
 * Each player's block of tiles is one SVG shape: tiles they own merge into
 * it, with no borders or gaps between them. Their name and category sit once,
 * centred in the largest rectangle inside the block, so text never crosses
 * the outline. Clicks still go to individual tiles, which are transparent
 * buttons laid over the shapes.
 */

const CORNER_RADIUS = 12;

type Props = {
  pieces: FloorData[];
  layout: BoardLayout;
  selectedFloorPiece?: FloorData;
  highlightedCategories: string[];
  isRandomizing: boolean;
  categoryName: (piece: FloorData) => string;
  onSelect: (piece: FloorData) => void;
};

export default function Board({
  pieces,
  layout,
  selectedFloorPiece,
  highlightedCategories,
  isRandomizing,
  categoryName,
  onSelect,
}: Props) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{
    width: number;
    height: number;
    gapX: number;
    gapY: number;
  } | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const measure = () => {
      const style = getComputedStyle(grid);
      setSize({
        width: grid.clientWidth,
        height: grid.clientHeight,
        gapX: parseFloat(style.columnGap) || 0,
        gapY: parseFloat(style.rowGap) || 0,
      });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(grid);
    return () => observer.disconnect();
  }, []);

  const territories = useMemo(
    () => findTerritories(pieces, layout.cols),
    [pieces, layout.cols]
  );

  /** Which territory each tile belongs to. */
  const territoryOf = useMemo(() => {
    const map = new Map<number, number>();
    for (const territory of territories) {
      for (const cell of territory.cells) map.set(cell, territory.id);
    }
    return map;
  }, [territories]);

  const geometry: Geometry | null = size
    ? {
        cols: layout.cols,
        rows: layout.rows,
        gapX: size.gapX,
        gapY: size.gapY,
        cellWidth: (size.width - size.gapX * (layout.cols - 1)) / layout.cols,
        cellHeight: (size.height - size.gapY * (layout.rows - 1)) / layout.rows,
      }
    : null;

  const states = territories.map((territory) => {
    const owner = pieces[territory.id];
    const isSelected =
      selectedFloorPiece?.person === owner.person &&
      selectedFloorPiece?.category === owner.category;
    const isHighlighted =
      !isRandomizing && !isSelected && highlightedCategories.includes(owner.category);
    return { territory, owner, isSelected, isHighlighted };
  });

  // Selected and challengeable blocks glow over their neighbours.
  const drawOrder = [...states].sort(
    (a, b) =>
      Number(a.isHighlighted) + 2 * Number(a.isSelected) -
      (Number(b.isHighlighted) + 2 * Number(b.isSelected))
  );

  return (
    <div
      ref={gridRef}
      className="relative grid gap-3 flex-1 min-h-0"
      style={{
        gridTemplateColumns: `repeat(${layout.cols}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${layout.rows}, minmax(0, 1fr))`,
      }}
    >
      {geometry && (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="territory-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" style={{ stopColor: "rgba(var(--rgb-24-70-170), 0.5)" }} />
              <stop offset="100%" style={{ stopColor: "rgba(var(--rgb-6-22-70), 0.78)" }} />
            </linearGradient>
            <linearGradient id="territory-fill-selected" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" style={{ stopColor: "var(--hx-4db0ff)" }} />
              <stop offset="55%" style={{ stopColor: "var(--hx-1677f2)" }} />
              <stop offset="100%" style={{ stopColor: "var(--hx-0b5fe0)" }} />
            </linearGradient>
            <linearGradient id="territory-fill-gold" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" style={{ stopColor: "rgba(var(--rgb-70-55-20), 0.6)" }} />
              <stop offset="100%" style={{ stopColor: "rgba(var(--rgb-22-16-6), 0.8)" }} />
            </linearGradient>
            <linearGradient id="territory-fill-gold-hover" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" style={{ stopColor: "rgba(var(--rgb-110-85-25), 0.7)" }} />
              <stop offset="100%" style={{ stopColor: "rgba(var(--rgb-40-28-8), 0.85)" }} />
            </linearGradient>
          </defs>
          {drawOrder.map(({ territory, isSelected, isHighlighted }) => (
            <path
              key={territory.id}
              d={territoryPath(territory.cells, geometry, CORNER_RADIUS)}
              className={classNames("territory-shape", {
                "territory-shape--selected": isSelected,
                "territory-shape--highlight": isHighlighted,
                "territory-shape--hover": isHighlighted && hovered === territory.id,
              })}
            />
          ))}
        </svg>
      )}

      {pieces.map((piece, index) => {
        const territoryId = territoryOf.get(index) ?? index;
        const state = states.find((s) => s.territory.id === territoryId);
        const clickable = !selectedFloorPiece || Boolean(state?.isHighlighted);

        return (
          <button
            key={`cell-${index}`}
            className={classNames("board-cell", { "board-cell--clickable": clickable })}
            style={{
              gridColumn: (index % layout.cols) + 1,
              gridRow: Math.floor(index / layout.cols) + 1,
            }}
            aria-label={`${index + 1}. ${piece.person}`}
            onMouseEnter={() => setHovered(territoryId)}
            onMouseLeave={() => setHovered((current) => (current === territoryId ? null : current))}
            onClick={() => {
              if (!clickable) return;
              onSelect(piece);
            }}
          >
            {/* One number per block -- a number in every merged tile is noise. */}
            {territoryId === index && (
              <span className="neon-tile-number">{index + 1}</span>
            )}
          </button>
        );
      })}

      {states.map(({ territory, owner, isSelected }) => (
        <div
          key={`label-${territory.id}`}
          className={classNames("territory-label", {
            "territory-label--selected": isSelected,
          })}
          style={{
            gridColumn: `${territory.label.col + 1} / span ${territory.label.cols}`,
            gridRow: `${territory.label.row + 1} / span ${territory.label.rows}`,
          }}
        >
          {/* The category is what the players pick, so it is always on show
              and is the big text; the owner is the smaller line under it. */}
          <p className="territory-name">{categoryName(owner)}</p>
          <p className="territory-category">{owner.person}</p>
        </div>
      ))}
    </div>
  );
}
