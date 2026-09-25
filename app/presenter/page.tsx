"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CATEGORY_METADATA,
  type Category,
  CategoryId,
  FloorData,
  GameDetails,
} from "../data";
import {
  categoryDisplayName,
  listSelectableCategories,
  MIXED_CATEGORY_ID,
  resolveCategory,
  type ResolvedExample,
} from "../categories/registry";
import { useCuratedOverrides } from "../categories/useCuratedOverrides";
import { REVEAL_STATE, RoundDisplay } from "../projector/round";
import FloorButton from "../components/FloorButton";
import FloorLogo from "../components/FloorLogo";
import FloorPageLayout from "../components/FloorPageLayout";
import {
  arrangeCategories,
  catalogEntry,
  DIFFICULTY_INFO,
  type Difficulty,
} from "../categories/catalog";
import { newShuffleSeed, seededShuffle } from "../categories/shuffle";
import {
  CategorySections,
  CategoryViewControls,
  DifficultyMark,
  useCategoryViewOptions,
} from "../categories/CategoryView";
import { useLocalStorage } from "usehooks-ts";

export enum PROJECTOR_MESSAGE_TYPE {
  RANDOMIZER = "RANDOMIZER",
  GO_BACK_TO_FLOOR = "GO_BACK_TO_FLOOR",
  RESTART = "RESTART",
  START_ROUND = "START_ROUND",
  FINISH_ROUND = "FINISH_ROUND",
  PASS_ROUND = "PASS_ROUND",
  REVEAL_ROUND = "REVEAL_ROUND",
}

export enum PRESENTER_MESSAGE_TYPE {
  SET_CURRENT_ROUND_EXAMPLE = "SET_CURRENT_ROUND_EXAMPLE",
  END_ROUND = "END_ROUND",
}

export default function PresenterPage({
  params,
  searchParams,
}: {
  params: Promise<any>;
  searchParams: Promise<any>;
}) {
  const [projectorWindow, setProjectorWindow] = useState<Window | null>(null);
  const [roundDetails, setRoundDetails] = useState<{
    category: CategoryId;
    challenger: FloorData;
    defender: FloorData;
    exampleIndex: number;
    roundState: REVEAL_STATE;
    example: ResolvedExample;
  }>();
  const [gameDetails, setGameDetails] = useState<GameDetails | undefined>(
    undefined
  );
  const [liveGameDetails, setLiveGameDetails] = useLocalStorage<
    GameDetails | undefined
  >("the-floor-data", undefined);
  const [hasResumedLiveGame, setHasResumedLiveGame] = useState(false);

  // Game setup state
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [newPlayerCategory, setNewPlayerCategory] = useState<
    CategoryId | undefined
  >(undefined);
  // Seed behind the one-per-difficulty category suggestions for the next
  // player; a new seed draws new suggestions.
  const [suggestionSeed, setSuggestionSeed] = useState(newShuffleSeed);
  const [editPlayerName, setEditPlayerName] = useState("");
  const [editPlayerCategory, setEditPlayerCategory] = useState<
    CategoryId | undefined
  >(undefined);

  // Quick duel setup: an empty category means nothing is picked yet.
  const [demoDetails, setDemoDetails] = useState<{
    category: CategoryId;
  }>();
  const [demoQuery, setDemoQuery] = useState("");
  const [viewOptions, setViewOptions] = useCategoryViewOptions();
  // Quick duels keep the category's fixed order unless the host asks otherwise.
  const [demoShuffle, setDemoShuffle] = useState(false);

  // The exact list the projector is playing, in its order. Needed because a
  // single round shuffles its examples, so the presenter cannot re-resolve
  // the category and match by index.
  const [roundExamples, setRoundExamples] = useState<ResolvedExample[]>();

  const curatedOverrides = useCuratedOverrides();

  const desktopPlayWarning = (
    <div
      className="w-full bg-yellow-500/10 border-2 border-yellow-400/80 rounded-lg p-4 text-yellow-100 lg:hidden"
      style={{ boxShadow: "0 0 20px rgba(234, 179, 8, 0.15)" }}
    >
      <p className="font-bold">Do gry wymagany jest komputer.</p>
      <p className="text-sm text-yellow-100/90 mt-1">
        Panel prowadzącego otwiera osobne okno projektora i korzysta z wielu
        okien/wyskakujących okienek, więc gra nie działa na urządzeniach
        mobilnych.
      </p>
    </div>
  );

  const examples = useMemo(() => {
    if (roundDetails?.category == null) {
      return [];
    }

    if (roundExamples) {
      return roundExamples;
    }

    return (
      resolveCategory(roundDetails.category, curatedOverrides)
        ?.examples ?? []
    );
  }, [roundDetails?.category, roundExamples, curatedOverrides]);

  const channel = new BroadcastChannel("the-floor-projector");

  const openProjector = () => {
    const newWindow = window.open("/projector", "projector", "fullscreen=yes");
    if (newWindow) {
      if (projectorWindow) {
        projectorWindow.close();
      }

      setProjectorWindow(newWindow);
    }
  };

  const triggerStartDemoRound = (
    category = demoDetails?.category ?? "",
    shuffle = demoShuffle
  ) => {
    const newWindow = window.open(
      `/demo?category=${encodeURIComponent(category)}${shuffle ? "&shuffle=1" : ""}`,
      "debug",
      "fullscreen=yes"
    );

    setDemoDetails(undefined);

    if (newWindow) {
      if (projectorWindow) {
        projectorWindow.close();
      }

      setProjectorWindow(newWindow);
    }
  };

  const triggerRandomizer = () => {
    channel.postMessage({ type: PROJECTOR_MESSAGE_TYPE.RANDOMIZER });
  };

  const triggerGoBackToFloor = () => {
    channel.postMessage({ type: PROJECTOR_MESSAGE_TYPE.GO_BACK_TO_FLOOR });
  };

  const triggerStartRound = () => {
    channel.postMessage({ type: PROJECTOR_MESSAGE_TYPE.START_ROUND });
  };

  const triggerFinishRound = (forceWin?: "challenger" | "defender") => {
    channel.postMessage({
      type: PROJECTOR_MESSAGE_TYPE.FINISH_ROUND,
      forceWin,
    });

    setRoundDetails(undefined);
  };

  const triggerPassRound = () => {
    channel.postMessage({ type: PROJECTOR_MESSAGE_TYPE.PASS_ROUND });
  };

  const triggerRevealRound = () => {
    channel.postMessage({ type: PROJECTOR_MESSAGE_TYPE.REVEAL_ROUND });
  };

  const triggerRestart = () => {
    channel.postMessage({ type: PROJECTOR_MESSAGE_TYPE.RESTART });
  };

  useEffect(() => {
    const channel = new BroadcastChannel("the-floor-presenter");
    channel.addEventListener("message", (event) => {
      switch (event.data.type) {
        case PRESENTER_MESSAGE_TYPE.SET_CURRENT_ROUND_EXAMPLE:
          setRoundDetails({
            category: event.data.category,
            challenger: event.data.challenger,
            defender: event.data.defender,
            exampleIndex: event.data.selectedExampleIndex,
            roundState: event.data.state,
            example: event.data.example,
          });
          if (Array.isArray(event.data.roundExamples)) {
            setRoundExamples(event.data.roundExamples);
          }
          break;
        case PRESENTER_MESSAGE_TYPE.END_ROUND:
          setRoundDetails(undefined);
          setRoundExamples(undefined);
          break;
        default:
          console.warn("Unknown message type", event.data.type);
          break;
      }
    });

    return () => {
      channel.close();
    };
  }, []);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Only handle keyboard shortcuts when in round mode
      if (!roundDetails) return;

      // Check if we're in a state where buttons are visible
      if (
        roundDetails.roundState === REVEAL_STATE.FINISHED ||
        roundDetails.roundState === REVEAL_STATE.NOT_STARTED
      ) {
        return;
      }

      // Handle "1" key for Pass
      if (event.key === "1") {
        const isDisabled =
          roundDetails.roundState === REVEAL_STATE.PASSED ||
          roundDetails.roundState === REVEAL_STATE.REVEALED;
        if (!isDisabled) {
          triggerPassRound();
        }
      }

      // Handle "2" key for Correct
      if (event.key === "2") {
        const isDisabled =
          roundDetails.roundState === REVEAL_STATE.REVEALED ||
          roundDetails.roundState === REVEAL_STATE.PASSED;
        if (!isDisabled) {
          triggerRevealRound();
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [roundDetails]);

  // GAME SETUP
  if (gameDetails) {
    // Get used categories to prevent duplicates
    const usedCategories = new Set(gameDetails.data.map((p) => p.category));

    // Get available categories (not used by other players)
    const getAvailableCategories = (currentCategory?: CategoryId) =>
      listSelectableCategories().filter(
        ({ id }) => !usedCategories.has(id) || id === currentCategory
      );

    // Category <option>s following the shared view settings: <optgroup>s when
    // grouping is on, a difficulty emoji in front of the name when shown.
    const categoryOptions = (currentCategory?: CategoryId) =>
      arrangeCategories(getAvailableCategories(currentCategory), viewOptions).map(
        ({ group, items }) => {
          const options = items.map(({ id, name }) => {
            const difficulty = catalogEntry(String(id))?.difficulty;
            const mark =
              viewOptions.showDifficulty && difficulty
                ? `${DIFFICULTY_INFO[difficulty].emoji} `
                : "";
            return (
              <option key={id} value={id}>
                {mark}
                {name}
              </option>
            );
          });
          return group ? (
            <optgroup key={group.id} label={`${group.emoji} ${group.label}`}>
              {options}
            </optgroup>
          ) : (
            options
          );
        }
      );

    // One free category per difficulty level for the next player to pick from.
    const suggestions = ([1, 2, 3] as Difficulty[]).flatMap((difficulty) => {
      const pool = getAvailableCategories().filter(
        ({ id }) => catalogEntry(String(id))?.difficulty === difficulty
      );
      const [pick] = seededShuffle(pool, suggestionSeed + difficulty);
      return pick ? [{ ...pick, difficulty }] : [];
    });
    const isSuggested = suggestions.some(({ id }) => id === newPlayerCategory);

    const pickRandomCategory = () => {
      const free = getAvailableCategories();
      if (free.length > 0) {
        setNewPlayerCategory(free[Math.floor(Math.random() * free.length)].id);
      }
    };

    const startGame = () => {
      if (gameDetails.data.length === 0) return;
      setLiveGameDetails(gameDetails);
      setGameDetails(undefined);
      openProjector();
    };

    const handleAddPlayer = () => {
      if (!newPlayerName.trim() || newPlayerCategory === undefined) return;

      // Check if category is already used
      if (usedCategories.has(newPlayerCategory)) {
        alert("Ta kategoria jest już przypisana innemu graczowi!");
        return;
      }

      const newPlayer: FloorData = {
        person: newPlayerName.trim(),
        category: newPlayerCategory,
        hasPlayed: false,
        isStillInTheGame: true,
      };

      setGameDetails({
        data: [...gameDetails.data, newPlayer],
      });

      setNewPlayerName("");
      setNewPlayerCategory(undefined);
      setSuggestionSeed(newShuffleSeed());
    };

    const handleUpdatePlayer = (index: number) => {
      if (!editPlayerName.trim() || editPlayerCategory === undefined) return;

      // Check if category is already used by another player
      const currentPlayer = gameDetails.data[index];
      if (
        editPlayerCategory !== currentPlayer.category &&
        usedCategories.has(editPlayerCategory)
      ) {
        alert("Ta kategoria jest już przypisana innemu graczowi!");
        return;
      }

      const updatedData = [...gameDetails.data];
      updatedData[index] = {
        ...updatedData[index],
        person: editPlayerName.trim(),
        category: editPlayerCategory,
      };

      setGameDetails({ data: updatedData });
      setEditingIndex(null);
    };

    const handleDeletePlayer = (index: number) => {
      const updatedData = gameDetails.data.filter((_, i) => i !== index);
      setGameDetails({ data: updatedData });
      if (editingIndex === index) {
        setEditingIndex(null);
      }
    };

    const handleStartEdit = (index: number) => {
      const player = gameDetails.data[index];
      setEditPlayerName(player.person);
      setEditPlayerCategory(player.category);
      setEditingIndex(index);
    };

    const handleCancelEdit = () => {
      setEditingIndex(null);
      setEditPlayerName("");
      setEditPlayerCategory(undefined);
    };

    const fieldClass =
      "bg-gray-900 text-white p-3 rounded-md border-2 border-neon focus:outline-none focus:ring-2 focus:ring-neon";

    return (
      <FloorPageLayout back={{ onClick: () => setGameDetails(undefined) }}>
        <div className="w-full max-w-4xl mx-auto px-6 pt-4 pb-32 flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <h1
              className="text-4xl md:text-5xl font-bold uppercase tracking-wide glow-text"
              style={{ color: "var(--color-neon)" }}
            >
              Nowa gra
            </h1>
            <p className="text-sm md:text-base uppercase tracking-[0.2em] text-white/70">
              Dodaj graczy i przydziel każdemu kategorię
            </p>
          </div>
          <div className="w-full lg:hidden">{desktopPlayWarning}</div>

          {/* Add a player */}
          <form
            className="neon-panel p-4 md:p-5 flex flex-col gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              handleAddPlayer();
            }}
          >
            <input
              type="text"
              placeholder="Imię gracza"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              className={fieldClass}
              autoFocus
            />

            {suggestions.length > 0 && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm uppercase tracking-[0.15em] text-white/70">
                    Propozycje kategorii
                  </p>
                  <button
                    type="button"
                    className="text-sm text-white/70 underline underline-offset-4 hover:text-white"
                    onClick={() => setSuggestionSeed(newShuffleSeed())}
                  >
                    Inne propozycje
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {suggestions.map(({ id, name, difficulty }) => (
                    <FloorButton
                      key={difficulty}
                      type="button"
                      variant="rectangular"
                      aria-pressed={id === newPlayerCategory}
                      className={`${id === newPlayerCategory ? "btn-primary" : ""} flex flex-col items-center gap-1 !py-4 text-sm`}
                      onClick={() => setNewPlayerCategory(id)}
                    >
                      <span className="text-xs font-normal normal-case tracking-normal text-white/70">
                        {DIFFICULTY_INFO[difficulty].emoji} {DIFFICULTY_INFO[difficulty].label}
                      </span>
                      <span className="text-center">{name}</span>
                    </FloorButton>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col md:flex-row gap-3">
              <select
                value={isSuggested ? "" : newPlayerCategory || ""}
                onChange={(e) => setNewPlayerCategory(e.target.value || undefined)}
                className={`${fieldClass} flex-1 min-w-0`}
              >
                <option value="">…albo wybierz z wszystkich kategorii</option>
                {categoryOptions()}
              </select>
              <FloorButton
                type="button"
                variant="rectangular"
                className="font-semibold text-sm"
                onClick={pickRandomCategory}
              >
                Całkowicie losowa
              </FloorButton>
              <FloorButton
                type="submit"
                variant="rectangular"
                className="btn-primary font-semibold text-sm"
                disabled={!newPlayerName.trim() || newPlayerCategory === undefined}
              >
                Dodaj
              </FloorButton>
            </div>
            {newPlayerCategory !== undefined && (
              <p className="text-sm text-white/70">
                Wybrana kategoria:{" "}
                <span className="font-bold text-white">
                  {categoryDisplayName(newPlayerCategory)}
                </span>
              </p>
            )}
          </form>
          <CategoryViewControls options={viewOptions} onChange={setViewOptions} />

          {/* Players */}
          {gameDetails.data.length === 0 ? (
            <p className="text-center text-white/60 py-10">
              Nie dodano jeszcze żadnych graczy.
            </p>
          ) : (
            <ol className="flex flex-col gap-2">
              {gameDetails.data.map((player, index) => {
                const isEditing = editingIndex === index;

                return (
                  <li
                    key={index}
                    className="neon-panel px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3"
                  >
                    <span className="w-8 shrink-0 text-lg font-bold text-white/50">
                      {index + 1}.
                    </span>
                    {isEditing ? (
                      <>
                        <input
                          type="text"
                          value={editPlayerName}
                          onChange={(e) => setEditPlayerName(e.target.value)}
                          className={`${fieldClass} !p-2 sm:w-48`}
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleUpdatePlayer(index);
                            if (e.key === "Escape") handleCancelEdit();
                          }}
                        />
                        <select
                          value={editPlayerCategory || ""}
                          onChange={(e) => setEditPlayerCategory(e.target.value || undefined)}
                          className={`${fieldClass} !p-2 flex-1 min-w-0`}
                        >
                          {categoryOptions(player.category)}
                        </select>
                        <div className="flex gap-2 shrink-0">
                          <FloorButton
                            variant="rectangular"
                            className="text-xs font-semibold !px-3 !py-2"
                            onClick={() => handleUpdatePlayer(index)}
                          >
                            Zapisz
                          </FloorButton>
                          <FloorButton
                            variant="rectangular"
                            className="text-xs font-semibold !px-3 !py-2"
                            onClick={handleCancelEdit}
                          >
                            Anuluj
                          </FloorButton>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-baseline sm:gap-4">
                          <p className="text-xl font-bold text-white truncate">
                            {player.person}
                          </p>
                          <p
                            className="text-sm font-semibold uppercase tracking-wide truncate"
                            style={{ color: "var(--color-neon)" }}
                          >
                            {categoryDisplayName(player.category)}
                          </p>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <FloorButton
                            variant="rectangular"
                            className="text-xs font-semibold !px-3 !py-2"
                            onClick={() => handleStartEdit(index)}
                          >
                            Edytuj
                          </FloorButton>
                          <FloorButton
                            variant="rectangular"
                            className="text-xs font-semibold !px-3 !py-2"
                            onClick={() => handleDeletePlayer(index)}
                          >
                            Usuń
                          </FloorButton>
                        </div>
                      </>
                    )}
                  </li>
                );
              })}
            </ol>
          )}
        </div>

        {/* Always in reach, however long the player list gets. */}
        <div className="fixed bottom-0 inset-x-0 z-30 bg-black/80 backdrop-blur border-t border-neon/40">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
            <p className="text-white/80">
              Gracze:{" "}
              <span className="font-bold text-white">{gameDetails.data.length}</span>
            </p>
            <FloorButton
              variant="rectangular"
              className="btn-primary font-bold shrink-0"
              disabled={gameDetails.data.length === 0}
              onClick={startGame}
            >
              Rozpocznij grę
            </FloorButton>
          </div>
        </div>
      </FloorPageLayout>
    );
  }

  // QUICK DUEL SETUP
  if (demoDetails) {
    const query = demoQuery.trim().toLowerCase();
    const choices = listSelectableCategories()
      .filter(({ name }) => name.toLowerCase().includes(query))
      .map(({ id, name }) => ({
        id,
        name,
        isText: CATEGORY_METADATA[id as Category].examples.some(
          (example) => "text" in example
        ),
      }));
    const selected = demoDetails.category;
    const pickRandom = () => {
      const all = listSelectableCategories();
      setDemoDetails({ category: all[Math.floor(Math.random() * all.length)].id });
    };

    return (
      <FloorPageLayout back={{ onClick: () => setDemoDetails(undefined) }}>
        <div className="w-full max-w-6xl mx-auto px-6 pt-4 pb-32 flex flex-col gap-5">
          <div className="flex flex-col items-center gap-2 text-center">
            <h1
              className="text-4xl md:text-5xl font-bold uppercase tracking-wide glow-text"
              style={{ color: "var(--color-neon)" }}
            >
              Szybki pojedynek
            </h1>
            <p className="text-sm md:text-base uppercase tracking-[0.2em] text-white/70">
              Jedna runda w wybranej kategorii
            </p>
          </div>
          <div className="w-full max-w-xl mx-auto lg:hidden">{desktopPlayWarning}</div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Szukaj kategorii..."
              value={demoQuery}
              onChange={(event) => setDemoQuery(event.target.value)}
              className="flex-1 bg-gray-900 text-white p-3 rounded-md border-2 border-neon focus:outline-none focus:ring-2 focus:ring-neon"
            />
            <FloorButton variant="rectangular" className="font-semibold" onClick={pickRandom}>
              Losuj kategorię
            </FloorButton>
          </div>
          <CategoryViewControls options={viewOptions} onChange={setViewOptions} />

          {choices.length === 0 ? (
            <p className="text-center text-white/60 py-8">
              Nie znaleziono kategorii pasujących do wyszukiwania
            </p>
          ) : (
            <CategorySections
              items={choices}
              options={viewOptions}
              gridClassName="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
              renderTile={({ id, name, isText }) => (
                <FloorButton
                  key={id}
                  variant="rectangular"
                  aria-pressed={id === selected}
                  className={`${id === selected ? "btn-primary" : ""} flex flex-col items-center justify-center gap-1 !py-5 text-sm normal-case`}
                  onClick={() => setDemoDetails({ category: id })}
                >
                  <span className="text-center uppercase">{name}</span>
                  <span className="text-xs font-normal text-white/70 normal-case tracking-normal">
                    {viewOptions.showDifficulty && (
                      <>
                        <DifficultyMark id={String(id)} />{" "}
                      </>
                    )}
                    {isText ? "Tekst" : "Obrazki"}
                  </span>
                </FloorButton>
              )}
            />
          )}
        </div>

        {/* Always in reach, however far down the list the host scrolled. */}
        <div className="fixed bottom-0 inset-x-0 z-30 bg-black/80 backdrop-blur border-t border-neon/40">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
            <p className="text-white/80 truncate">
              {selected ? (
                <>
                  Kategoria:{" "}
                  <span className="font-bold text-white">{categoryDisplayName(selected)}</span>
                </>
              ) : (
                "Wybierz kategorię"
              )}
            </p>
            <div className="flex items-center gap-4 shrink-0">
              <label className="flex items-center gap-2 text-sm text-white/80 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={demoShuffle}
                  onChange={(event) => setDemoShuffle(event.target.checked)}
                  className="w-5 h-5 accent-[var(--color-neon)]"
                />
                Losowa kolejność
              </label>
              <FloorButton
                variant="rectangular"
                className="btn-primary font-bold"
                disabled={!selected}
                onClick={() => triggerStartDemoRound()}
              >
                Start
              </FloorButton>
            </div>
          </div>
        </div>
      </FloorPageLayout>
    );
  }

  // ROUND MODE
  if (roundDetails) {
    return (
      <FloorPageLayout>
        <div className="p-8 md:p-20 flex flex-col gap-6">
          <h3
            className="text-4xl font-bold mb-6 glow-text"
            style={{ color: "var(--color-neon)" }}
          >
            Szczegóły rundy
          </h3>
          {desktopPlayWarning}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {roundDetails.roundState === REVEAL_STATE.NOT_STARTED && (
              <FloorButton
                variant="rectangular"
                className="cursor-pointer font-bold text-lg"
                onClick={() => triggerStartRound()}
              >
                Rozpocznij rundę
              </FloorButton>
            )}
            {roundDetails.roundState === REVEAL_STATE.FINISHED && (
              <FloorButton
                variant="rectangular"
                className="cursor-pointer font-bold text-lg"
                onClick={() => triggerFinishRound()}
              >
                Zakończ rundę
              </FloorButton>
            )}
            {roundDetails.roundState !== REVEAL_STATE.FINISHED &&
              roundDetails.roundState !== REVEAL_STATE.NOT_STARTED && (
                <div className="flex flex-col gap-4">
                  <p className="text-xl text-white font-semibold">
                    Użyj klawiatury, aby spasować lub zaliczyć odpowiedź:
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <FloorButton
                      variant="rectangular"
                      className="cursor-pointer font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      onClick={() => triggerPassRound()}
                      disabled={
                        roundDetails.roundState === REVEAL_STATE.PASSED ||
                        roundDetails.roundState === REVEAL_STATE.REVEALED
                      }
                    >
                      Pas{" "}
                      <code className="ml-2 px-2 py-1 bg-black/30 rounded">
                        [1]
                      </code>
                    </FloorButton>
                    <FloorButton
                      variant="rectangular"
                      className="cursor-pointer font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      onClick={() => triggerRevealRound()}
                      disabled={
                        roundDetails.roundState === REVEAL_STATE.REVEALED ||
                        roundDetails.roundState === REVEAL_STATE.PASSED
                      }
                    >
                      Dobrze{" "}
                      <code className="ml-2 px-2 py-1 bg-black/30 rounded">
                        [2]
                      </code>
                    </FloorButton>
                  </div>
                </div>
              )}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div
              className="neon-panel flex flex-col gap-4 p-6"
              style={{ boxShadow: "0 0 20px rgba(0, 212, 255, 0.2)" }}
            >
              {/* Every accepted answer, most fitting first: Polish word,
                  Polish alternatives, Polish proper name, English name. */}
              <div className="flex flex-col gap-1">
                <p className="text-sm uppercase tracking-widest text-white/60">
                  Aktualna odpowiedź
                </p>
                <p
                  className="text-3xl font-bold glow-text leading-tight"
                  style={{ color: "var(--color-neon)" }}
                >
                  {roundDetails.example?.name}
                </p>
                {(roundDetails.example?.alternatives.length ?? 0) > 0 && (
                  <ol className="flex flex-col gap-0.5 mt-1">
                    {roundDetails.example?.alternatives.map((answer) => (
                      <li
                        key={answer}
                        className="text-lg font-semibold"
                        style={{ color: "var(--color-gold)" }}
                      >
                        {answer}
                      </li>
                    ))}
                  </ol>
                )}
              </div>
              <p className="text-lg text-white">
                Przykład nr:{" "}
                <span className="font-bold" style={{ color: "var(--color-neon)" }}>
                  {roundDetails.exampleIndex}
                </span>
              </p>
              <p className="text-lg text-white">
                Liczba przykładów:{" "}
                <span className="font-bold" style={{ color: "var(--color-neon)" }}>
                  {examples?.length}
                </span>
              </p>


              <div className="flex flex-row gap-3 mt-4">
                <FloorButton
                  variant="rectangular"
                  className="cursor-pointer font-semibold text-sm flex-1"
                  onClick={() => triggerFinishRound("challenger")}
                >
                  Wymuś wygraną ({roundDetails.challenger.person})
                </FloorButton>

                <FloorButton
                  variant="rectangular"
                  className="cursor-pointer font-semibold text-sm flex-1"
                  onClick={() => triggerFinishRound("defender")}
                >
                  Wymuś wygraną ({roundDetails.defender.person})
                </FloorButton>
              </div>
            </div>

            {roundDetails.category && (
              <div
                className="neon-panel text-lg text-white max-h-[45vh] p-6"
                style={{ boxShadow: "0 0 20px rgba(0, 212, 255, 0.2)" }}
              >
                <RoundDisplay
                  examples={examples}
                  selectedExampleIndex={roundDetails.exampleIndex}
                />
              </div>
            )}
          </div>
        </div>
      </FloorPageLayout>
    );
  }

  if (liveGameDetails && !hasResumedLiveGame) {
    const players = liveGameDetails.data;
    return (
      <FloorPageLayout>
        <div className="p-8 md:p-20 flex flex-col gap-6 max-w-3xl mx-auto">
          <h3
            className="text-4xl font-bold mb-2 glow-text"
            style={{ color: "var(--color-neon)" }}
          >
            Wznowić trwającą grę?
          </h3>
          <p className="text-white/80">
            Znaleźliśmy zapisaną grę. Liczba graczy: {players.length}
            {players.length > 0 ? ":" : "."}
          </p>
          {players.length > 0 && (
            <ul className="text-white/90 list-disc list-inside">
              {players.map((p, i) => (
                <li key={i}>
                  <span className="font-semibold">{p.person}</span> —{" "}
                  {categoryDisplayName(p.category)}
                </li>
              ))}
            </ul>
          )}
          {desktopPlayWarning}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
            <FloorButton
              variant="rectangular"
              className="font-semibold"
              onClick={() => setHasResumedLiveGame(true)}
            >
              Wznów grę
            </FloorButton>
            <FloorButton
              variant="rectangular"
              className="font-semibold"
              onClick={() => {
                triggerRestart();
                setLiveGameDetails(undefined);
              }}
            >
              Nowa gra
            </FloorButton>
          </div>
        </div>
      </FloorPageLayout>
    );
  }

  if (liveGameDetails) {
    return (
      <FloorPageLayout>
        <div className="p-8 md:p-20 flex flex-col gap-6">
          <h3
            className="text-4xl font-bold mb-6 glow-text"
            style={{ color: "var(--color-neon)" }}
          >
            Trwająca gra
          </h3>
          {desktopPlayWarning}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <FloorButton
              variant="rectangular"
              className="font-semibold"
              onClick={() => triggerRandomizer()}
            >
              Losowanie
            </FloorButton>
            <FloorButton
              variant="rectangular"
              className="font-semibold"
              onClick={() => triggerGoBackToFloor()}
            >
              Wróć do planszy
            </FloorButton>
            <FloorButton
              variant="rectangular"
              className="font-semibold"
              onClick={() => {
                triggerRestart();
                setLiveGameDetails(undefined);
                setHasResumedLiveGame(false);
              }}
            >
              Zakończ grę
            </FloorButton>
          </div>
        </div>
      </FloorPageLayout>
    );
  }

  return (
    <FloorPageLayout back={{ fallback: "/" }}>
      {/* Fills the screen below the back button, so the whole menu fits without scrolling. */}
      <div className="flex-1 w-full flex flex-col items-center justify-center gap-[3vh] px-6 pb-[6vh] text-center">
        <div className="w-full max-w-xl lg:hidden">{desktopPlayWarning}</div>

        <div className="flex flex-col items-center gap-[1.5vh]">
          <h1 className="flex justify-center">
            <FloorLogo size="hero" />
          </h1>
          <p className="text-sm sm:text-base md:text-xl text-white/80 font-light uppercase tracking-[0.2em]">
            Zagraj w The Floor w domu
          </p>
        </div>

        {/* Equal-sized buttons; the start button is set apart only by colour. */}
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <FloorButton
            variant="rectangular"
            className="btn-primary w-full font-bold text-base"
            onClick={() => setGameDetails({ data: [] })}
          >
            Rozpocznij grę
          </FloorButton>
          <FloorButton
            variant="rectangular"
            className="w-full font-semibold text-base"
            onClick={() => {
              setDemoQuery("");
              setDemoDetails({ category: "" });
            }}
          >
            Szybki pojedynek
          </FloorButton>
          <FloorButton
            variant="rectangular"
            className="w-full font-semibold text-base"
            onClick={() => triggerStartDemoRound(MIXED_CATEGORY_ID, true)}
          >
            Miks kategorii
          </FloorButton>
        </div>

      </div>
    </FloorPageLayout>
  );
}
