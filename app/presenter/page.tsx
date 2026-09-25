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
import MenuHero, { MENU_BUTTON_CLASS, MENU_BUTTONS_CLASS } from "../components/MenuHero";
import { useHalloweenTheme } from "../components/useHalloweenTheme";
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
  DifficultyPips,
  useCategoryViewOptions,
} from "../categories/CategoryView";
import { useLocalStorage } from "usehooks-ts";

export enum PROJECTOR_MESSAGE_TYPE {
  RANDOMIZER = "RANDOMIZER",
  GO_BACK_TO_FLOOR = "GO_BACK_TO_FLOOR",
  RESTART = "RESTART",
  /** The game is over: the projector window closes itself. */
  CLOSE = "CLOSE",
  START_ROUND = "START_ROUND",
  FINISH_ROUND = "FINISH_ROUND",
  PASS_ROUND = "PASS_ROUND",
  REVEAL_ROUND = "REVEAL_ROUND",
  /** `{ paused: boolean }`: stops or resumes both clocks. */
  PAUSE_ROUND = "PAUSE_ROUND",
  /** `{ player: "challenger" | "defender", delta: number }` in seconds. */
  ADJUST_TIME = "ADJUST_TIME",
}

export enum PRESENTER_MESSAGE_TYPE {
  SET_CURRENT_ROUND_EXAMPLE = "SET_CURRENT_ROUND_EXAMPLE",
  END_ROUND = "END_ROUND",
  /** Both clocks, whose turn it is and whether the round is paused. */
  TIMER_STATE = "TIMER_STATE",
}

export type RoundTimerState = {
  challengerTimeLeft: number;
  defenderTimeLeft: number;
  currentTurn?: "challenger" | "defender";
  paused: boolean;
};

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
  const [roundTimer, setRoundTimer] = useState<RoundTimerState>();

  // Game setup state
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [newPlayerCategory, setNewPlayerCategory] = useState<
    CategoryId | undefined
  >(undefined);
  // Seed behind the one-per-difficulty category suggestions for the next
  // player; a new seed draws new suggestions.
  const [suggestionSeed, setSuggestionSeed] = useState(newShuffleSeed);
  // Category choice unlocks half a second after the host stops typing a name, and
  // that is when the three suggestions are drawn.
  const [categoryUiReady, setCategoryUiReady] = useState(false);
  useEffect(() => {
    setCategoryUiReady(false);
    if (!newPlayerName.trim()) return;
    const timer = setTimeout(() => {
      setCategoryUiReady(true);
      setSuggestionSeed(newShuffleSeed());
    }, 500);
    return () => clearTimeout(timer);
  }, [newPlayerName]);
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
  const halloween = useHalloweenTheme();
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

  const triggerPause = (paused: boolean) => {
    channel.postMessage({ type: PROJECTOR_MESSAGE_TYPE.PAUSE_ROUND, paused });
  };

  const triggerAdjustTime = (player: "challenger" | "defender", delta: number) => {
    channel.postMessage({ type: PROJECTOR_MESSAGE_TYPE.ADJUST_TIME, player, delta });
  };

  const triggerRestart = () => {
    channel.postMessage({ type: PROJECTOR_MESSAGE_TYPE.RESTART });
  };

  // Closes the projector window. The window handle is lost after a reload of
  // this page, so the projector is also asked to close itself.
  const closeProjector = () => {
    channel.postMessage({ type: PROJECTOR_MESSAGE_TYPE.CLOSE });
    projectorWindow?.close();
    setProjectorWindow(null);
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
        case PRESENTER_MESSAGE_TYPE.TIMER_STATE:
          setRoundTimer(event.data.timer);
          break;
        case PRESENTER_MESSAGE_TYPE.END_ROUND:
          setRoundDetails(undefined);
          setRoundExamples(undefined);
          setRoundTimer(undefined);
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

      // "P" or space pauses and resumes the clocks.
      if (event.key === "p" || event.key === "P" || event.key === " ") {
        event.preventDefault();
        triggerPause(!roundTimer?.paused);
        return;
      }
      if (roundTimer?.paused) return;

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
  }, [roundDetails, roundTimer?.paused]);

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
      arrangeCategories(getAvailableCategories(currentCategory), viewOptions, halloween).map(
        ({ group, items }) => {
          const options = items.map(({ id, name }) => {
            const difficulty = catalogEntry(String(id))?.difficulty;
            const mark =
              viewOptions.showDifficulty && difficulty
                ? `${DIFFICULTY_INFO[difficulty].dots}  `
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

    // Player names must be unique (ignoring case and surrounding spaces);
    // `exceptIndex` skips the player being edited.
    const isNameTaken = (name: string, exceptIndex?: number) => {
      const wanted = name.trim().toLocaleLowerCase("pl");
      return gameDetails.data.some(
        ({ person }, index) =>
          index !== exceptIndex && person.trim().toLocaleLowerCase("pl") === wanted
      );
    };
    const newNameTaken = newPlayerName.trim() !== "" && isNameTaken(newPlayerName);
    const editNameTaken =
      editingIndex !== null &&
      editPlayerName.trim() !== "" &&
      isNameTaken(editPlayerName, editingIndex);

    // A fully random free category other than the three on show, and the
    // player is added with it straight away.
    const addWithRandomCategory = () => {
      const shown = new Set(suggestions.map(({ id }) => id));
      const free = getAvailableCategories();
      const pool = free.filter(({ id }) => !shown.has(id));
      const from = pool.length > 0 ? pool : free;
      if (from.length === 0) return;
      handleAddPlayer(from[Math.floor(Math.random() * from.length)].id);
    };

    const startGame = () => {
      if (gameDetails.data.length === 0) return;
      setLiveGameDetails(gameDetails);
      setGameDetails(undefined);
      openProjector();
    };

    const handleAddPlayer = (category: CategoryId | undefined = newPlayerCategory) => {
      if (!newPlayerName.trim() || category === undefined) return;
      if (isNameTaken(newPlayerName)) return;

      // Check if category is already used
      if (usedCategories.has(category)) {
        alert("Ta kategoria jest już przypisana innemu graczowi!");
        return;
      }

      const newPlayer: FloorData = {
        person: newPlayerName.trim(),
        category,
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
      if (isNameTaken(editPlayerName, index)) return;

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
    const categoryUiLocked = !categoryUiReady || newNameTaken;

    return (
      <FloorPageLayout back={{ onClick: () => setGameDetails(undefined) }}>
        <div className="w-full max-w-7xl mx-auto px-6 pt-4 pb-32 flex flex-col gap-6">
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

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-6 items-start">
          {/* Left: adding a player */}
          <div className="min-w-0 flex flex-col gap-4 lg:sticky lg:top-4">
          <form
            className="neon-panel min-w-0 p-4 md:p-5 flex flex-col gap-4"
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
              className={`${fieldClass} ${newNameTaken ? "!border-red-500" : ""}`}
              aria-invalid={newNameTaken}
              autoFocus
            />
            {newNameTaken && (
              <p className="-mt-2 text-sm text-red-400">
                Gracz o tym imieniu jest już na liście.
              </p>
            )}

            {!newPlayerName.trim() && (
              <p className="-mt-1 text-sm text-white/50">
                Wpisz imię gracza, żeby wybrać kategorię.
              </p>
            )}

            <fieldset
              disabled={categoryUiLocked}
              className={`min-w-0 m-0 p-0 border-0 flex flex-col gap-4 transition-opacity ${categoryUiLocked ? "opacity-40" : ""}`}
            >
            {/* Drawn only once a name is in, so nothing is suggested for nobody. */}
            {categoryUiReady && suggestions.length > 0 && (
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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 min-w-0">
                  {suggestions.map(({ id, name, difficulty }) => (
                    <FloorButton
                      key={difficulty}
                      type="button"
                      variant="rectangular"
                      aria-pressed={id === newPlayerCategory}
                      className={`${id === newPlayerCategory ? "btn-primary" : ""} min-w-0 flex flex-col items-center gap-1 !px-3 !py-4 text-sm break-words`}
                      onClick={() => setNewPlayerCategory(id)}
                    >
                      <span className="text-xs font-normal normal-case tracking-normal text-white/70">
                        <DifficultyPips level={difficulty} /> {DIFFICULTY_INFO[difficulty].label}
                      </span>
                      <span className="text-center">{name}</span>
                    </FloorButton>
                  ))}
                </div>
              </div>
            )}

            <select
              value={isSuggested ? "" : newPlayerCategory || ""}
              onChange={(e) => setNewPlayerCategory(e.target.value || undefined)}
              className={`${fieldClass} w-full min-w-0`}
            >
              <option value="">…albo wybierz z wszystkich kategorii</option>
              {categoryOptions()}
            </select>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FloorButton
                type="button"
                variant="rectangular"
                className="font-semibold text-sm"
                onClick={addWithRandomCategory}
                title="Losuje kategorię spoza trzech propozycji i od razu dodaje gracza"
              >
                Całkowicie losowa
              </FloorButton>
              <FloorButton
                type="submit"
                variant="rectangular"
                className="btn-primary font-semibold text-sm"
                disabled={
                  !newPlayerName.trim() || newNameTaken || newPlayerCategory === undefined
                }
              >
                Dodaj
              </FloorButton>
            </div>
            </fieldset>
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
          </div>

          {/* Right: the players so far */}
          <div className="flex flex-col gap-3">
          <p className="text-sm uppercase tracking-[0.15em] text-white/70">
            Gracze ({gameDetails.data.length})
          </p>
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
                          className={`${fieldClass} !p-2 sm:w-48 ${editNameTaken ? "!border-red-500" : ""}`}
                          aria-invalid={editNameTaken}
                          title={editNameTaken ? "Gracz o tym imieniu jest już na liście." : undefined}
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
                            disabled={editNameTaken}
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
          </div>
        </div>

        {/* Always in reach, however long the player list gets. */}
        <div data-bottom-bar className="fixed bottom-0 inset-x-0 z-30 bg-black/80 backdrop-blur border-t border-neon/40">
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
        <div data-bottom-bar className="fixed bottom-0 inset-x-0 z-30 bg-black/80 backdrop-blur border-t border-neon/40">
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
                        roundTimer?.paused ||
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
                        roundTimer?.paused ||
                        roundDetails.roundState === REVEAL_STATE.REVEALED ||
                        roundDetails.roundState === REVEAL_STATE.PASSED
                      }
                    >
                      Dobrze{" "}
                      <code className="ml-2 px-2 py-1 bg-black/30 rounded">
                        [2]
                      </code>
                    </FloorButton>
                    <FloorButton
                      variant="rectangular"
                      className={`${roundTimer?.paused ? "btn-primary" : ""} cursor-pointer font-bold text-lg`}
                      onClick={() => triggerPause(!roundTimer?.paused)}
                    >
                      {roundTimer?.paused ? "Wznów" : "Pauza"}{" "}
                      <code className="ml-2 px-2 py-1 bg-black/30 rounded">[P]</code>
                    </FloorButton>
                  </div>
                </div>
              )}
          </div>

          {/* While paused (or after the clock ran out) the host can correct
              either player's time, e.g. after a misclick. */}
          {roundTimer &&
            (roundTimer.paused || roundDetails.roundState === REVEAL_STATE.FINISHED) && (
              <div className="neon-panel p-5 flex flex-col gap-4 mb-6">
                <p className="text-lg font-semibold text-white">
                  {roundTimer.paused
                    ? "Gra wstrzymana. Możesz poprawić czas graczy."
                    : "Runda skończona. Jeśli czas skończył się przez pomyłkę, dodaj go graczowi, a gra wróci wstrzymana."}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(["challenger", "defender"] as const).map((player) => {
                    const time =
                      player === "challenger"
                        ? roundTimer.challengerTimeLeft
                        : roundTimer.defenderTimeLeft;
                    return (
                      <div key={player} className="flex flex-col gap-2">
                        <p className="text-white/80">
                          {roundDetails[player].person}
                          {roundTimer.currentTurn === player && (
                            <span className="text-white/50"> · teraz odpowiada</span>
                          )}
                        </p>
                        <div className="flex items-center gap-2">
                          {[-5, -1].map((delta) => (
                            <FloorButton
                              key={delta}
                              variant="rectangular"
                              className="font-bold !px-3 !py-2"
                              disabled={time <= 0}
                              onClick={() => triggerAdjustTime(player, delta)}
                            >
                              {delta}
                            </FloorButton>
                          ))}
                          <span className="w-16 text-center text-3xl font-bold text-white tabular-nums">
                            {time}
                          </span>
                          {[1, 5].map((delta) => (
                            <FloorButton
                              key={delta}
                              variant="rectangular"
                              className="font-bold !px-3 !py-2"
                              onClick={() => triggerAdjustTime(player, delta)}
                            >
                              +{delta}
                            </FloorButton>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div
              className="neon-panel flex flex-col gap-4 p-6"
              style={{ boxShadow: "0 0 20px rgba(var(--rgb-58-166-255), 0.2)" }}
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
                style={{ boxShadow: "0 0 20px rgba(var(--rgb-58-166-255), 0.2)" }}
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
                closeProjector();
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

        <MenuHero
          tagline="Zagraj w The Floor w domu"
          halloweenTagline="Mroczne rozgrywki w twoim domu"
        />

        {/* Equal-sized buttons; the start button is set apart only by colour. */}
        <div className={MENU_BUTTONS_CLASS}>
          <FloorButton
            variant="rectangular"
            className={`btn-primary ${MENU_BUTTON_CLASS}`}
            onClick={() => setGameDetails({ data: [] })}
          >
            Rozpocznij grę
          </FloorButton>
          <FloorButton
            variant="rectangular"
            className={MENU_BUTTON_CLASS}
            onClick={() => {
              setDemoQuery("");
              setDemoDetails({ category: "" });
            }}
          >
            Szybki pojedynek
          </FloorButton>
          <FloorButton
            variant="rectangular"
            className={MENU_BUTTON_CLASS}
            onClick={() => triggerStartDemoRound(MIXED_CATEGORY_ID, true)}
          >
            Miks kategorii
          </FloorButton>
        </div>

      </div>
    </FloorPageLayout>
  );
}
