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

export default function CategoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState<
    Category | undefined
  >(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const curatedOverrides = useCuratedOverrides();

  // Filter categories based on search query, by the name shown on screen
  const filteredCategories = (Object.keys(CATEGORY_METADATA) as Category[])
    .filter((category) =>
      CATEGORY_METADATA[category].name
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    )
    .sort((a, b) =>
      CATEGORY_METADATA[a].name.localeCompare(CATEGORY_METADATA[b].name, "pl")
    );

  // The page itself is the only scroller, so switching between the list and a
  // category starts from the top of the page.
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [selectedCategory]);

  if (selectedCategory) {
    const categoryData = CATEGORY_METADATA[selectedCategory];
    const examples = categoryData.examples;

    return (
      <FloorPageLayout>
        <div className="w-full p-8 md:p-20 flex flex-col gap-6 max-w-7xl mx-auto">
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
              <FloorButton
                variant="rectangular"
                className="font-semibold"
                onClick={() => setSelectedCategory(undefined)}
              >
                Wróć do kategorii
              </FloorButton>
            </div>
          </div>

          {/* Category Info */}
          <div className="neon-panel p-4 mb-6">
            <p className="text-white">
              <span className="font-semibold" style={{ color: "var(--color-neon)" }}>
                Liczba przykładów:
              </span>{" "}
              {examples.length}
            </p>
          </div>

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
    <FloorPageLayout>
      <div className="w-full p-8 md:p-20 flex flex-col gap-6 max-w-7xl mx-auto">
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

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredCategories.length === 0 ? (
            <div className="col-span-full text-center text-white/60 py-8">
              Nie znaleziono kategorii pasujących do wyszukiwania
            </div>
          ) : (
            filteredCategories.map((category) => {
              const categoryData = CATEGORY_METADATA[category];
              return (
                <FloorButton
                  key={category}
                  variant="rectangular"
                  className="font-semibold text-base flex flex-col items-center justify-center gap-2 p-8"
                  onClick={() => setSelectedCategory(category)}
                >
                  <span className="text-center">{categoryData.name}</span>
                  <span
                    className="text-xs font-normal"
                    style={{ color: "var(--color-neon)" }}
                  >
                    przykłady: {categoryData.examples.length}
                  </span>
                </FloorButton>
              );
            })
          )}
        </div>

        {/* Back Button */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 border-t-2 border-neon/30">
          <FloorButton
            variant="rectangular"
            className="font-semibold"
            onClick={() => (window.location.href = "/presenter")}
          >
            Wróć do panelu prowadzącego
          </FloorButton>
          <Link href="/about" prefetch={false}>
            <FloorButton variant="rectangular" className="font-semibold">
              O grze
            </FloorButton>
          </Link>
          <Link href="/categories/contribute" prefetch={false}>
            <FloorButton variant="rectangular" className="font-semibold">
              Jak dodać więcej kategorii
            </FloorButton>
          </Link>
        </div>
      </div>
    </FloorPageLayout>
  );
}
