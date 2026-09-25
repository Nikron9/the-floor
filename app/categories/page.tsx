"use client";

import { useEffect, useState } from "react";
import {
  Category,
  CATEGORY_METADATA,
  ImageExample,
  TextExample,
} from "../data";
import FloorPageLayout from "../components/FloorPageLayout";
import FloorButton from "../components/FloorButton";
import Link from "next/link";
import { useCuratedOverrides } from "./useCuratedOverrides";
import { answerList, primaryAnswer } from "./answers";
import { newShuffleSeed, seededShuffle } from "./shuffle";
import { CATEGORY_GROUPS, DIFFICULTY_INFO, CATEGORY_CATALOG } from "./catalog";
import {
  CategorySections,
  CategoryViewControls,
  DifficultyMark,
  useCategoryViewOptions,
} from "./CategoryView";

export default function CategoriesPage() {
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
  }, [selectedCategory]);

  if (selectedCategory) {
    const categoryData = CATEGORY_METADATA[selectedCategory];
    const gameOrder = categoryData.examples as Array<ImageExample | TextExample>;
    const examples =
      exampleOrder === "game"
        ? gameOrder
        : exampleOrder === "alpha"
          ? [...gameOrder].sort((a, b) =>
              primaryAnswer(a).localeCompare(primaryAnswer(b), "pl")
            )
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
              {examples.some((item) => "image" in item) && (
                <Link href={`/categories/edit/${categoryData.folder}`} prefetch={false}>
                  <FloorButton variant="rectangular" className="font-semibold">
                    Podmień obrazki
                  </FloorButton>
                </Link>
              )}
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
                {CATEGORY_GROUPS.find(({ id }) => id === CATEGORY_CATALOG[selectedCategory].group)?.emoji}{" "}
                {CATEGORY_GROUPS.find(({ id }) => id === CATEGORY_CATALOG[selectedCategory].group)?.label}
              </span>
              <span>
                {DIFFICULTY_INFO[CATEGORY_CATALOG[selectedCategory].difficulty].emoji} Trudność:{" "}
                {DIFFICULTY_INFO[CATEGORY_CATALOG[selectedCategory].difficulty].label.toLowerCase()}
              </span>
              <span>Przykłady: {examples.length}</span>
            </p>
          </div>

          <label className="flex items-center gap-2 text-sm text-white/80 -mt-4">
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

          {/* Examples Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {examples.map((item, index) => {
              const isTextExample = "text" in item;
              const isImageExample = "image" in item;

              return (
                <div
                  key={index}
                  className="neon-panel p-6 flex flex-col gap-4"
                >
                  {isTextExample ? (
                    <div className="flex flex-col gap-3">
                      <div className="bg-gray-800 p-4 rounded-md min-h-[100px] flex items-center justify-center">
                        <p className="text-3xl font-bold text-white text-center">
                          {item.text}
                        </p>
                      </div>
                      <div className="flex flex-col items-center w-full text-center gap-2">
                        <p className="w-full font-white font-bold text-2xl">
                          {primaryAnswer(item)}
                        </p>
                        {answerList(item).length > 1 && (
                          <p className="text-sm text-white/60 text-center">
                            także: {answerList(item).slice(1).join(", ")}
                          </p>
                        )}
                      </div>
                    </div>
                  ) : isImageExample ? (
                    <div className="flex flex-col gap-3">
                      <div className="bg-gray-800 rounded-md overflow-hidden flex items-center justify-center min-h-[200px]">
                        {/* Browsing a category renders every example at
                            once, so without lazy loading the browser fetches
                            all ~50 images up front to fill a 200px box. */}
                        <img
                          src={
                            curatedOverrides[categoryData.folder]?.[item.image] ??
                            `/images/${categoryData.folder}/${item.image}`
                          }
                          alt={primaryAnswer(item)}
                          className="max-w-full max-h-[200px] object-contain"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <p className="w-full font-white font-bold text-2xl text-center">
                          {primaryAnswer(item)}
                        </p>
                        {answerList(item).length > 1 && (
                          <p className="text-sm text-white/60 text-center">
                            także: {answerList(item).slice(1).join(", ")}
                          </p>
                        )}
                      </div>
                    </div>
                  ) : null}
                </div>
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
            style={{ boxShadow: "0 0 10px rgba(0, 212, 255, 0.3)" }}
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
                  <span className="text-xl leading-none">
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
