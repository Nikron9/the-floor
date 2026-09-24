"use client";
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { CategoryId, FLOOR_DATA, FloorData, GameDetails } from "../data";
import { categoryDisplayName } from "../categories/registry";
import { useCommunityCategories } from "../categories/useCommunityCategories";
import { PROJECTOR_MESSAGE_TYPE } from "../presenter/page";
import Round from "./round";
import Board from "./board";
import { boardLayout, neighbourIndices } from "./boardLayout";
import { markDrawn, planDraw, winnerHasPlayed } from "./randomizer";
import { useLocalStorage } from "usehooks-ts";
import confetti from "canvas-confetti";
import FloorPageLayout from "../components/FloorPageLayout";
import FloorButton from "../components/FloorButton";
import FloorLogo from "../components/FloorLogo";

interface Round {
  category: CategoryId;
  challenger: FloorData;
  defender: FloorData;
}

export function Projector() {
  const [mounted, setMounted] = useState(false);

  const [gameDetails, setGameDetails, removeGameDetails] = useLocalStorage<
    GameDetails | undefined
  >("the-floor-data", undefined);

  const [selectedFloorPiece, setSelectedFloorPiece] = useLocalStorage<
    FloorData | undefined
  >("the-floor-selected-floor-piece", undefined);

  const [round, setRound] = useLocalStorage<Round | undefined>(
    "the-floor-round",
    undefined
  );

  const { categories: communityCategories } = useCommunityCategories();

  const [isRandomizing, setIsRandomizing] = useState(false);

  // Ensure we only render after hydration to avoid mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const onRestart = useCallback(() => {
    removeGameDetails();
    setSelectedFloorPiece(undefined);
    setRound(undefined);
  }, [removeGameDetails, setSelectedFloorPiece, setRound]);

  const randomizeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const randomizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const finalSelectedPieceRef = useRef<FloorData | null>(null);

  // Read through a ref: the spin changes the selection every 250ms, and
  // having it in onRandomize's dependencies would re-create the broadcast
  // channel effect -- whose cleanup cancels the spin halfway through.
  const selectedFloorPieceRef = useRef(selectedFloorPiece);
  useEffect(() => {
    selectedFloorPieceRef.current = selectedFloorPiece;
  }, [selectedFloorPiece]);

  const onRandomize = useCallback(() => {
    setIsRandomizing(true);

    // Clear any existing randomize timers
    if (randomizeIntervalRef.current) {
      clearInterval(randomizeIntervalRef.current);
    }
    if (randomizeTimeoutRef.current) {
      clearTimeout(randomizeTimeoutRef.current);
    }

    const pieces = gameDetails?.data ?? [];
    if (pieces.length === 0) {
      setIsRandomizing(false);
      return;
    }

    // Whoever is selected right now just won (or was just drawn) and is
    // passing their turn, so they sit this draw out. See randomizer.ts for
    // the rest of the rules.
    const plan = planDraw(pieces, selectedFloorPieceRef.current?.person);
    const finalPerson =
      plan.candidates[Math.floor(Math.random() * plan.candidates.length)];
    const tilesOf = (person: string) =>
      pieces.filter((piece) => piece.person === person);

    // The spin runs over everyone still eligible, so it isn't obvious who the
    // smallest-territory rule will land on until it stops.
    randomizeIntervalRef.current = setInterval(() => {
      const person =
        plan.eligible[Math.floor(Math.random() * plan.eligible.length)];
      const tiles = tilesOf(person);
      const randomFloorPiece = tiles[Math.floor(Math.random() * tiles.length)];
      if (randomFloorPiece) setSelectedFloorPiece(randomFloorPiece);
    }, 250);

    // Random duration between 2 and 4 seconds
    const randomDuration = 2000 + Math.random() * 2000;

    randomizeTimeoutRef.current = setTimeout(() => {
      if (randomizeIntervalRef.current) {
        clearInterval(randomizeIntervalRef.current);
        randomizeIntervalRef.current = null;
      }

      const finalTiles = tilesOf(finalPerson);
      const finalPiece =
        finalTiles[Math.floor(Math.random() * finalTiles.length)];
      finalSelectedPieceRef.current = finalPiece ?? null;
      if (finalPiece) setSelectedFloorPiece(finalPiece);

      setIsRandomizing(false);
      setGameDetails((prev) => ({
        ...prev,
        data: markDrawn(prev?.data ?? [], finalPerson, plan.resetPool),
      }));
    }, randomDuration);
  }, [gameDetails, setSelectedFloorPiece, setGameDetails]);

  useEffect(() => {
    const channel = new BroadcastChannel("the-floor-projector");
    channel.addEventListener("message", (event) => {
      switch (event.data.type) {
        case PROJECTOR_MESSAGE_TYPE.RANDOMIZER:
          onRandomize();
          break;
        case PROJECTOR_MESSAGE_TYPE.GO_BACK_TO_FLOOR:
          setSelectedFloorPiece(undefined);
          break;
        case PROJECTOR_MESSAGE_TYPE.RESTART:
          onRestart();
          break;
        default:
          console.warn("Unknown message type", event.data.type);
          break;
      }
    });

    // Cleanup on unmount
    return () => {
      if (randomizeIntervalRef.current) {
        clearInterval(randomizeIntervalRef.current);
      }
      if (randomizeTimeoutRef.current) {
        clearTimeout(randomizeTimeoutRef.current);
      }

      channel.close();
    };
  }, [onRestart, onRandomize]);

  const pieceCount = gameDetails?.data?.length ?? 0;
  const layout = useMemo(() => boardLayout(pieceCount), [pieceCount]);

  const highlightedFloorPieceCategories = useMemo(() => {
    const allSelectedFloorPieces =
      gameDetails?.data
        ?.map((piece: FloorData, index: number) => {
          const isSameCategory =
            piece.category === selectedFloorPiece?.category;
          const isSamePerson = piece.person === selectedFloorPiece?.person;
          const isValid = isSameCategory && isSamePerson;

          return isValid ? index : null;
        })
        .filter((index) => index != null) ?? [];

    if (allSelectedFloorPieces.length === 0) return [];

    const highlightedFloorPieceCategories = allSelectedFloorPieces
      .flatMap((index) =>
        getHighlightedFloorPieceCategories(
          index,
          selectedFloorPiece?.person ?? "",
          gameDetails?.data ?? [],
          layout.cols
        )
      )
      // Filter out selected piece if it's in the highlighted categories
      .filter((category) => category !== selectedFloorPiece?.category);

    return highlightedFloorPieceCategories;
  }, [selectedFloorPiece, gameDetails, layout.cols]);

  const onSelectOrMerge = (
    winner: FloorData,
    loser: FloorData,
    newCategory: CategoryId
  ) => {
    const pieces = gameDetails?.data ?? [];
    // A defender who wins was never drawn; only the challenger counts as
    // having had their turn. Applied to every tile the winner owns, since
    // the flag is read per person.
    const winnerPlayed = winnerHasPlayed(
      pieces,
      winner.person,
      round?.challenger.person ?? winner.person
    );

    const newWinnerPiece = {
      ...winner,
      hasPlayed: winnerPlayed,
      category: newCategory,
    };

    const newFloorPieces =
      gameDetails?.data?.map((piece: FloorData) => {
        // Overwrite the newly selected floor piece with the winning one (existing piece for now)
        if (
          piece.category === loser.category &&
          piece.person === loser.person
        ) {
          return newWinnerPiece;
        }

        if (
          piece.category === winner.category &&
          piece.person === winner.person
        ) {
          return newWinnerPiece;
        }

        return piece.person === winner.person
          ? { ...piece, hasPlayed: winnerPlayed }
          : piece;
      }) ?? [];

    setGameDetails((prev) => {
      return {
        ...prev,
        data: newFloorPieces,
      };
    });
    setSelectedFloorPiece(newWinnerPiece);
    setRound(undefined);
  };

  const onStartRound = useCallback(
    (floorPiece: FloorData) => {
      if (selectedFloorPiece == null) {
        setSelectedFloorPiece(floorPiece);
        return;
      }

      setRound({
        category: floorPiece.category,
        challenger: selectedFloorPiece,
        defender: floorPiece,
      });
    },
    [selectedFloorPiece, setSelectedFloorPiece, setRound]
  );

  const whoIsRemaining = useMemo(
    () =>
      new Set(gameDetails?.data?.map((piece: FloorData) => piece.person) ?? []),
    [gameDetails]
  );

  useEffect(() => {
    if (whoIsRemaining.size === 1) {
      const timeout = setInterval(() => {
        // Confetti
        confetti({
          particleCount: 100,
          spread: 300,
          origin: { y: 0.5 },
        });
      }, 2000);

      return () => clearInterval(timeout);
    }
  }, [whoIsRemaining]);

  // Don't render until after hydration to avoid mismatch
  if (!mounted) {
    return (
      <FloorPageLayout>
        <div className="grid grid-cols-4 grid-rows-10 h-full p-20 w-full" />
      </FloorPageLayout>
    );
  }

  if (!gameDetails) {
    return (
      <FloorPageLayout>
        <div className="flex flex-col items-center justify-center h-full text-white text-xl gap-4 font-bold w-full">
          <p className="text-center">Nie znaleziono gry</p>
          <p className="text-center">Wróć, aby rozpocząć nową grę</p>
          <FloorButton
            variant="rectangular"
            className="font-semibold"
            onClick={() => (window.location.href = "/presenter")}
          >
            Wróć
          </FloorButton>
        </div>
      </FloorPageLayout>
    );
  }

  if (whoIsRemaining.size === 1) {
    return (
      <FloorPageLayout>
        <div className="flex flex-col items-center justify-center min-h-screen gap-12 text-white w-full">
          <FloorLogo size="md" />
          <p className="text-center text-9xl font-black metallic-text">
            {Array.from(whoIsRemaining)[0]} wygrywa!
          </p>
        </div>
      </FloorPageLayout>
    );
  }

  if (round) {
    return (
      <Round
        category={round.category}
        challenger={round.challenger}
        defender={round.defender}
        onFinish={onSelectOrMerge}
      />
    );
  }

  return (
    <FloorPageLayout>
      <div className="h-screen w-full flex flex-col gap-5 px-16 py-6">
        <header className="grid grid-cols-[1fr_auto_1fr] items-center gap-6">
          <div />
          <FloorLogo size="sm" />
          <div className="flex justify-end">
            {selectedFloorPiece && (
              <SelectedPlayerCard
                person={selectedFloorPiece.person}
                isRandomizing={isRandomizing}
              />
            )}
          </div>
        </header>
        <Board
          pieces={gameDetails?.data ?? []}
          layout={layout}
          selectedFloorPiece={selectedFloorPiece}
          highlightedCategories={highlightedFloorPieceCategories}
          isRandomizing={isRandomizing}
          categoryName={(piece) =>
            categoryDisplayName(piece.category, communityCategories)
          }
          onSelect={onStartRound}
        />
      </div>
    </FloorPageLayout>
  );
}

/** Top-right card naming whoever the randomiser landed on. */
function SelectedPlayerCard({
  person,
  isRandomizing,
}: {
  person: string;
  isRandomizing: boolean;
}) {
  return (
    <div className="neon-panel flex items-center gap-4 pl-4 pr-8 py-3 min-w-[280px]">
      <div className="w-14 h-14 shrink-0 rounded-full border-2 border-neon grid place-items-center shadow-[0_0_14px_rgba(58,166,255,0.7)]">
        <svg viewBox="0 0 24 24" className="w-8 h-8 fill-neon-bright" aria-hidden="true">
          <circle cx="12" cy="8" r="4.2" />
          <path d="M3.5 21c0-4.7 3.8-8 8.5-8s8.5 3.3 8.5 8z" />
        </svg>
      </div>
      <div className="flex flex-col">
        <span className="text-sm text-white/70">
          {isRandomizing ? "Losowanie…" : "Wylosowany gracz"}
        </span>
        <span className="text-3xl font-bold leading-tight">{person}</span>
      </div>
    </div>
  );
}

const getHighlightedFloorPieceCategories = (
  selectedIndex: number,
  selectedPerson: string,
  floorPieces: FloorData[],
  cols: number
): string[] =>
  neighbourIndices(selectedIndex, floorPieces.length, cols)
    .filter((index) => floorPieces[index]?.person !== selectedPerson)
    .map((index) => floorPieces[index]?.category);

export default function ProjectorPage({ params }: { params: Promise<any> }) {
  return (
    <Suspense fallback={<div>Ładowanie...</div>}>
      <Projector />
    </Suspense>
  );
}
