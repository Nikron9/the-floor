"use client";

import { useEffect, useState } from "react";
import { Category, CATEGORY_METADATA } from "../data";
import FloorPageLayout from "../components/FloorPageLayout";
import FloorButton from "../components/FloorButton";
import Link from "next/link";
import { useCuratedOverrides } from "./useCuratedOverrides";
import { curatedItems } from "./examples";
import { newShuffleSeed, seededShuffle } from "./shuffle";
import { DIFFICULTY_INFO, CATEGORY_CATALOG, categoryGroup } from "./catalog";
import { useHalloweenTheme } from "../components/useHalloweenTheme";
import {
  CategorySections,
  CategoryViewControls,
  DifficultyMark,
  useCategoryViewOptions,
} from "./CategoryView";

export default function CategoriesPage() {
  const halloween = useHalloweenTheme();
  const [selectedCategory, setSelectedCategory] = useState<
    Category | undefined
  >(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  // How a category's examples are listed: a fresh random order each time a
  // category is opened, so browsing doesn't spoil the in-game order.
  const [exampleOrder, setExampleOrder] = useState<"random" | "alpha" | "game">(
    "random"
  );
  const [previewSeed, setPreviewSeed] = useState(0);
  // Answers stay hidden while browsing, so looking at a category doesn't
  // spoil it; a click on one card reveals just that answer.
  const [showAnswers, setShowAnswers] = useState(false);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const curatedOverrides = useCuratedOverrides();
  const [viewOptions, setViewOptions] = useCategoryViewOptions();

  // Filter categories based on search query, by the name shown on screen;
  // sorting and grouping happen in CategorySections.
  const filteredCategories = (Object.keys(CATEGORY_METADATA) as Category[])
    .map((id) => ({ id, name: CATEGORY_METADATA[id].name }))
    .filter(({ name }) => name.toLowerCase().includes(searchQuery.toLowerCase()));

  // The page itself is the only scroller, so switching between the list and a
  // category starts from the top of the page.
  useEffect(() => {
    window.scrollTo({ top: 0 });
    setExampleOrder("random");
    setPreviewSeed(newShuffleSeed());
    setShowAnswers(false);
    setRevealed(new Set());
  }, [selectedCategory]);

  if (selectedCategory) {
    const categoryData = CATEGORY_METADATA[selectedCategory];
    // With the edits made in the app; added pictures without an image yet
    // don't appear in the game, so they aren't shown here either.
    const gameOrder = curatedItems(selectedCategory, curatedOverrides).filter(
      (item) => item.text !== undefined || item.src
    );
    const examples =
      exampleOrder === "game"
        ? gameOrder
        : exampleOrder === "alpha"
          ? [...gameOrder].sort((a, b) => a.name.localeCompare(b.name, "pl"))
          : seededShuffle(gameOrder, previewSeed);

    return (
      <FloorPageLayout back={{ onClick: () => setSelectedCategory(undefined) }}>
        <div className="w-full px-6 md:px-12 pt-4 pb-16 flex flex-col gap-6 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-row items-center justify-between mb-4">
            <h2
              className="text-4xl font-bold glow-text"
              style={{ color: "var(--color-neon)" }}
            >
              {CATEGORY_METADATA[selectedCategory].name}
            </h2>
            <div className="flex gap-2 flex-wrap justify-end">
              <Link href={`/categories/edit/${categoryData.folder}`} prefetch={false}>
                <FloorButton variant="rectangular" className="font-semibold">
                  Edytuj kategorię
                </FloorButton>
              </Link>
            </div>
          </div>

          {/* Category Info */}
          <div className="neon-panel p-4 mb-6 flex flex-col gap-3">
            {categoryData.instruction && (
              <p className="text-white text-lg font-semibold">
                {categoryData.instruction}
              </p>
            )}
            {categoryData.details && (
              <ul className="text-white/80 space-y-1 list-disc pl-6">
                {categoryData.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            )}
            <p className="text-white/80 text-sm flex flex-wrap gap-x-6 gap-y-1">
              <span>
                {categoryGroup(selectedCategory, halloween)?.emoji}{" "}
                {categoryGroup(selectedCategory, halloween)?.label}
              </span>
              <span>
                <DifficultyMark id={selectedCategory} /> Trudność:{" "}
                {DIFFICULTY_INFO[CATEGORY_CATALOG[selectedCategory].difficulty].label.toLowerCase()}
              </span>
              <span>Przykłady: {examples.length}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 -mt-4">
          <label className="flex items-center gap-2 text-sm text-white/80">
            Kolejność:
            <select
              value={exampleOrder}
              onChange={(event) =>
                setExampleOrder(event.target.value as typeof exampleOrder)
              }
              className="bg-gray-900 text-white px-2 py-1 rounded-md border border-neon focus:outline-none"
            >
              <option value="random">Losowa</option>
              <option value="alpha">Alfabetycznie</option>
              <option value="game">Jak w grze</option>
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm text-white/80 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showAnswers}
              onChange={(event) => {
                setShowAnswers(event.target.checked);
                setRevealed(new Set());
              }}
              className="w-5 h-5 accent-[var(--color-neon)]"
            />
            Pokaż odpowiedzi
          </label>
          {!showAnswers && (
            <span className="text-xs text-white/50">Kliknij element, żeby zobaczyć jego odpowiedź.</span>
          )}
          </div>

          {/* Examples Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {examples.map((item) => {
              const visible = showAnswers || revealed.has(item.key);
              return (
                <button
                  type="button"
                  key={item.key}
                  className="neon-panel p-6 flex flex-col gap-4 text-left"
                  onClick={() =>
                    setRevealed((current) => {
                      const next = new Set(current);
                      if (next.has(item.key)) next.delete(item.key);
                      else next.add(item.key);
                      return next;
                    })
                  }
                  aria-label={visible ? item.name : "Pokaż odpowiedź"}
                >
                  {item.text !== undefined ? (
                    <div className="bg-gray-800 p-4 rounded-md min-h-[100px] w-full flex items-center justify-center">
                      <p className="text-3xl font-bold text-white text-center">{item.text}</p>
                    </div>
                  ) : (
                    <div className="bg-gray-800 rounded-md overflow-hidden w-full flex items-center justify-center min-h-[200px]">
                      {/* Browsing a category renders every example at
                          once, so without lazy loading the browser fetches
                          all ~50 images up front to fill a 200px box. */}
                      <img
                        src={item.src}
                        alt={visible ? item.name : ""}
                        className="max-w-full max-h-[200px] object-contain"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  )}
                  <div className="flex flex-col items-center w-full text-center gap-2 min-h-[3.5rem] justify-center">
                    {visible ? (
                      <>
                        <p className="w-full text-white font-bold text-2xl">{item.name}</p>
                        {item.alternatives.length > 0 && (
                          <p className="text-sm text-white/60">
                            także: {item.alternatives.join(", ")}
                          </p>
                        )}
                      </>
                    ) : (
                      <p className="text-white/30 text-2xl tracking-[0.3em]">? ? ?</p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </FloorPageLayout>
    );
  }

  return (
    <FloorPageLayout back>
      <div className="w-full px-6 md:px-12 pt-4 pb-16 flex flex-col gap-6 max-w-7xl mx-auto">
        {/* Header */}
        <h1
          className="text-4xl font-bold mb-4 glow-text"
          style={{ color: "var(--color-neon)" }}
        >
          Kategorie
        </h1>

        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Szukaj kategorii..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-900 text-white p-3 rounded-md border-2 border-neon focus:outline-none focus:ring-2 focus:ring-neon focus:ring-offset-2 focus:ring-offset-black"
            style={{ boxShadow: "0 0 10px rgba(var(--rgb-58-166-255), 0.3)" }}
          />
        </div>
        <CategoryViewControls options={viewOptions} onChange={setViewOptions} />

        {/* Categories Grid */}
        {filteredCategories.length === 0 ? (
          <div className="text-center text-white/60 py-8">
            Nie znaleziono kategorii pasujących do wyszukiwania
          </div>
        ) : (
          <CategorySections
            items={filteredCategories}
            options={viewOptions}
            gridClassName="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            renderTile={({ id, name }) => (
              <FloorButton
                key={id}
                variant="rectangular"
                className="font-semibold text-base flex flex-col items-center justify-center gap-2 p-8"
                onClick={() => setSelectedCategory(id)}
              >
                {viewOptions.showDifficulty && (
                  <span className="leading-none text-white/70">
                    <DifficultyMark id={id} />
                  </span>
                )}
                <span className="text-center">{name}</span>
              </FloorButton>
            )}
          />
        )}

      </div>
    </FloorPageLayout>
  );
}
