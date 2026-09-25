"use client";

import { useEffect, useMemo, useState } from "react";
import { CategoryId, FloorData, GameDetails } from "../data";
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
import { useLocalStorage } from "usehooks-ts";
import Link from "next/link";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [newPlayerCategory, setNewPlayerCategory] = useState<
    CategoryId | undefined
  >(undefined);
  const [editPlayerName, setEditPlayerName] = useState("");
  const [editPlayerCategory, setEditPlayerCategory] = useState<
    CategoryId | undefined
  >(undefined);

  const [demoDetails, setDemoDetails] = useState<{
    category: CategoryId;
  }>();

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

  const triggerStartDemoRound = (category = demoDetails?.category ?? "") => {
    const newWindow = window.open(
      `/demo?category=${encodeURIComponent(category)}`,
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

    // Filter players based on search query, matching the category's display
    // name rather than its key.
    const filteredPlayers = gameDetails.data.filter((player) => {
      const query = searchQuery.toLowerCase();
      return (
        player.person.toLowerCase().includes(query) ||
        categoryDisplayName(player.category)
          .toLowerCase()
          .includes(query)
      );
    });

    // Get available categories (not used by other players)
    const getAvailableCategories = (currentCategory?: CategoryId) =>
      listSelectableCategories().filter(
        ({ id }) => !usedCategories.has(id) || id === currentCategory
      );

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

    return (
      <FloorPageLayout>
        <div className="p-8 md:p-20 flex flex-col gap-6 w-full max-w-7xl mx-auto">
          <h3
            className="text-4xl font-bold mb-4 glow-text"
            style={{ color: "var(--color-neon)" }}
          >
            Ustawienia gry
          </h3>

          {desktopPlayWarning}

          {/* Search Bar */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Szukaj graczy lub kategorii..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-900 text-white p-3 rounded-md border-2 border-neon focus:outline-none focus:ring-2 focus:ring-neon focus:ring-offset-2 focus:ring-offset-black"
              style={{ boxShadow: "0 0 10px rgba(0, 212, 255, 0.3)" }}
            />
          </div>

          {/* Add New Player Form */}
          <div className="neon-panel p-6 mb-6">
            <h4
              className="text-2xl font-bold mb-4 glow-text"
              style={{ color: "var(--color-neon)" }}
            >
              Dodaj nowego gracza
            </h4>
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="Imię gracza"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                className="flex-1 bg-gray-800 text-white p-3 rounded-md border-2 border-neon focus:outline-none focus:ring-2 focus:ring-neon"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddPlayer();
                }}
              />
              <select
                value={newPlayerCategory || ""}
                onChange={(e) =>
                  setNewPlayerCategory(e.target.value || undefined)
                }
                className="flex-1 bg-gray-800 text-white p-3 rounded-md border-2 border-neon focus:outline-none focus:ring-2 focus:ring-neon"
              >
                <option value="">Wybierz kategorię...</option>
                {getAvailableCategories().map(({ id, name }) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </select>
              <FloorButton
                variant="rectangular"
                className="font-semibold"
                onClick={handleAddPlayer}
                disabled={
                  !newPlayerName.trim() || newPlayerCategory === undefined
                }
              >
                Dodaj gracza
              </FloorButton>
            </div>
          </div>

          {/* Players List */}
          <div className="flex flex-col gap-4 mb-6">
            <h4
              className="text-2xl font-bold glow-text"
              style={{ color: "var(--color-neon)" }}
            >
              Gracze ({gameDetails.data.length})
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto">
              {filteredPlayers.length === 0 ? (
                <div className="col-span-full text-center text-white/60 py-8">
                  {searchQuery
                    ? "Nie znaleziono graczy pasujących do wyszukiwania"
                    : "Nie dodano jeszcze żadnych graczy"}
                </div>
              ) : (
                filteredPlayers.map((player, index) => {
                  const actualIndex = gameDetails.data.indexOf(player);
                  const isEditing = editingIndex === actualIndex;

                  return (
                    <div
                      key={actualIndex}
                      className="neon-panel p-4 flex flex-col gap-3"
                    >
                      {isEditing ? (
                        <>
                          <input
                            type="text"
                            value={editPlayerName}
                            onChange={(e) => setEditPlayerName(e.target.value)}
                            className="bg-gray-800 text-white p-2 rounded-md border border-neon focus:outline-none focus:ring-2 focus:ring-neon"
                            onKeyDown={(e) => {
                              if (e.key === "Enter")
                                handleUpdatePlayer(actualIndex);
                              if (e.key === "Escape") handleCancelEdit();
                            }}
                          />
                          <select
                            value={editPlayerCategory || ""}
                            onChange={(e) =>
                              setEditPlayerCategory(e.target.value || undefined)
                            }
                            className="bg-gray-800 text-white p-2 rounded-md border border-neon focus:outline-none focus:ring-2 focus:ring-neon"
                          >
                            {getAvailableCategories(player.category).map(
                              ({ id, name }) => (
                                <option key={id} value={id}>
                                  {name}
                                </option>
                              )
                            )}
                          </select>
                          <div className="flex gap-2">
                            <FloorButton
                              variant="rectangular"
                              className="flex-1 text-sm font-semibold"
                              onClick={() => handleUpdatePlayer(actualIndex)}
                            >
                              Zapisz
                            </FloorButton>
                            <FloorButton
                              variant="rectangular"
                              className="flex-1 text-sm font-semibold"
                              onClick={handleCancelEdit}
                            >
                              Anuluj
                            </FloorButton>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex flex-col gap-1">
                            <p className="text-xl font-bold text-white">
                              {player.person}
                            </p>
                            <p
                              className="text-sm font-semibold"
                              style={{ color: "var(--color-neon)" }}
                            >
                              {categoryDisplayName(player.category)}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <FloorButton
                              variant="rectangular"
                              className="flex-1 text-sm font-semibold"
                              onClick={() => handleStartEdit(actualIndex)}
                            >
                              Edytuj
                            </FloorButton>
                            <FloorButton
                              variant="rectangular"
                              className="flex-1 text-sm font-semibold"
                              onClick={() => handleDeletePlayer(actualIndex)}
                            >
                              Usuń
                            </FloorButton>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end pt-4 border-t-2 border-neon/30">
            <FloorButton
              variant="rectangular"
              className="font-bold text-lg w-full sm:w-auto"
              onClick={() => setGameDetails(undefined)}
            >
              Anuluj
            </FloorButton>
            <FloorButton
              variant="rectangular"
              className="font-bold text-lg w-full sm:w-auto"
              onClick={() => {
                if (gameDetails.data.length === 0) {
                  alert("Dodaj co najmniej jednego gracza, aby rozpocząć grę!");
                  return;
                }
                setLiveGameDetails(gameDetails);
                setGameDetails(undefined);
                openProjector();
              }}
              disabled={gameDetails.data.length === 0}
            >
              Rozpocznij grę
            </FloorButton>
          </div>
        </div>
      </FloorPageLayout>
    );
  }

  // DEMO SETUP
  if (demoDetails) {
    return (
      <FloorPageLayout>
        <div className="p-8 md:p-20 flex flex-col gap-6">
          <h3
            className="text-4xl font-bold mb-6 glow-text"
            style={{ color: "var(--color-neon)" }}
          >
            Pojedyncza runda
          </h3>
          {desktopPlayWarning}
          <label className="text-xl font-bold flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center mb-4">
            <span className="glow-text" style={{ color: "var(--color-neon)" }}>
              Kategoria:
            </span>
            <select
              onChange={(e) => setDemoDetails({ category: e.target.value })}
              value={demoDetails?.category}
              className="w-full sm:w-auto bg-gray-900 text-white p-3 rounded-md border-2 border-neon focus:outline-none focus:ring-2 focus:ring-neon focus:ring-offset-2 focus:ring-offset-black"
              style={{ boxShadow: "0 0 10px rgba(0, 212, 255, 0.3)" }}
            >
              {listSelectableCategories().map(
                ({ id, name }) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                )
              )}
            </select>
          </label>
          <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6">
            <FloorButton
              variant="rectangular"
              className="font-bold text-lg w-full sm:w-auto"
              onClick={() => setDemoDetails(undefined)}
            >
              Anuluj
            </FloorButton>
            <FloorButton
              variant="rectangular"
              className="font-bold text-lg w-full sm:w-auto"
              onClick={() => triggerStartDemoRound()}
            >
              Start
            </FloorButton>
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
    <FloorPageLayout>
      {/* Sized to the viewport so the whole menu fits on one screen. */}
      <div className="min-h-dvh w-full flex flex-col items-center justify-center gap-[3vh] px-6 py-[3vh] text-center">
        <div className="w-full max-w-xl lg:hidden">{desktopPlayWarning}</div>

        <div className="flex flex-col items-center gap-[1.5vh]">
          <h1 className="flex justify-center">
            <FloorLogo size="hero" />
          </h1>
          <p className="text-sm sm:text-base md:text-xl text-white/80 font-light uppercase tracking-[0.2em]">
            Zagraj w The Floor w domu
          </p>
        </div>

        <FloorButton
          variant="square"
          className="font-bold text-xl relative z-10 w-[clamp(8.75rem,20vh,11rem)]"
          onClick={() => setGameDetails({ data: [] })}
        >
          Rozpocznij grę
        </FloorButton>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl">
          <FloorButton
            variant="rectangular"
            className="font-semibold text-base"
            onClick={() => setDemoDetails({ category: "Aplikacje" })}
          >
            Pojedyncza runda
          </FloorButton>
          <FloorButton
            variant="rectangular"
            className="font-semibold text-base"
            onClick={() => triggerStartDemoRound(MIXED_CATEGORY_ID)}
          >
            Co to jest?
          </FloorButton>
        </div>

        <nav className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm font-semibold uppercase tracking-wider text-white/70">
          <Link className="hover:text-white" href="/categories" prefetch={false}>
            Kategorie
          </Link>
          <Link className="hover:text-white" href="/about" prefetch={false}>
            O grze
          </Link>
        </nav>
      </div>
    </FloorPageLayout>
  );
}
