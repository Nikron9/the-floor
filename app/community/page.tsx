/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import FloorButton from "@/app/components/FloorButton";
import FloorPageLayout from "@/app/components/FloorPageLayout";
import { useCommunityCategories } from "@/app/categories/useCommunityCategories";
import { communityCategoryId } from "@/app/categories/registry";
import type { CommunityCategorySummary } from "@/lib/community/types";

import { getCategory, listCategories, reportCategory, voteOnCategory } from "./api";

export default function CommunityPage() {
  const [sort, setSort] = useState<"top" | "new">("top");
  const [categories, setCategories] = useState<CommunityCategorySummary[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState("");
  const [pending, setPending] = useState<string | null>(null);

  /**
   * The API has always paged -- the page just never asked for the second one,
   * so everything past the first 24 was unreachable.
   */
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const { categories: mine, addCategory, removeCategory } = useCommunityCategories();

  const load = useCallback(async (which: "top" | "new") => {
    setStatus("loading");
    try {
      const { categories: found, hasMore: more } = await listCategories(which);
      setCategories(found);
      setHasMore(more);
      setStatus("ready");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Nie udało się wczytać.");
      setStatus("error");
    }
  }, []);

  const loadMore = useCallback(async () => {
    setLoadingMore(true);
    setError("");
    try {
      // Offset by what's on screen rather than a page counter: the two only
      // agree while nothing is published mid-browse.
      const { categories: found, hasMore: more } = await listCategories(
        sort,
        categories.length
      );

      setCategories((previous) => {
        // Paging by offset can repeat a category if one is published while
        // you're reading, which would also collide on React's keys.
        const seen = new Set(previous.map((category) => category.id));
        return [...previous, ...found.filter((c) => !seen.has(c.id))];
      });
      setHasMore(more);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Nie udało się wczytać więcej.");
    } finally {
      setLoadingMore(false);
    }
  }, [sort, categories.length]);

  useEffect(() => {
    load(sort);
  }, [sort, load]);

  const onVote = async (id: string, direction: -1 | 1) => {
    const current = categories.find((category) => category.id === id);
    if (!current) return;

    // Clicking the arrow you already picked takes the vote back.
    const next = current.myVote === direction ? 0 : direction;

    try {
      const result = await voteOnCategory(id, next);
      setCategories((previous) =>
        previous.map((category) =>
          category.id === id
            ? {
                ...category,
                upvotes: result.upvotes,
                downvotes: result.downvotes,
                score: result.upvotes - result.downvotes,
                myVote: result.myVote,
              }
            : category
        )
      );
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Nie udało się zagłosować.");
    }
  };

  /**
   * Copy the whole category into this browser.
   *
   * The presenter and projector are two windows sharing localStorage, and the
   * game has to keep working if the category is edited or taken down later --
   * so this stores a snapshot rather than a reference.
   */
  const onAdd = async (summary: CommunityCategorySummary) => {
    setPending(summary.id);
    setError("");
    try {
      const { category } = await getCategory(summary.id);
      addCategory({
        id: category.id,
        name: category.name,
        examples: category.items
          .filter((item) => item.imageUrl)
          .map((item) => ({
            name: item.name,
            alternatives: item.alternatives,
            src: item.imageUrl as string,
          })),
      });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Nie udało się dodać.");
    } finally {
      setPending(null);
    }
  };

  const onReport = async (id: string) => {
    const reason = window.prompt(
      "Co jest nie tak z tą kategorią? (obraźliwa, uszkodzone obrazki, spam…)"
    );
    if (reason === null) return;

    try {
      const result = await reportCategory(id, reason);
      if (result.hidden) {
        setCategories((previous) => previous.filter((c) => c.id !== id));
      }
      setError(
        result.hidden
          ? "Zgłoszono — kategoria jest ukryta do czasu weryfikacji."
          : "Zgłoszono. Dziękujemy."
      );
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Nie udało się zgłosić.");
    }
  };

  return (
    <FloorPageLayout>
      <div className="p-6 md:p-12 max-w-7xl mx-auto flex flex-col gap-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <h1
              className="text-4xl font-bold glow-text mb-2"
              style={{ color: "#00d4ff" }}
            >
              Kategorie społeczności
            </h1>
            <p className="text-white/70">
              Tworzone przez społeczność, więc jakość bywa różna. Są trzymane
              osobno od{" "}
              <Link href="/categories" className="underline text-[#00d4ff]">
                wbudowanych kategorii
              </Link>
              , które są przygotowane ręcznie. Głosuj na dobre i zgłaszaj te,
              które takie nie są.
            </p>
          </div>

          <Link href="/community/create">
            <FloorButton variant="rectangular" className="font-semibold">
              Utwórz kategorię
            </FloorButton>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {(["top", "new"] as const).map((option) => (
            <button
              key={option}
              onClick={() => setSort(option)}
              className={`px-4 py-2 text-sm font-semibold rounded ${
                sort === option
                  ? "bg-[#00d4ff] text-black"
                  : "bg-gray-800 text-white/70 hover:bg-gray-700"
              }`}
            >
              {option === "top" ? "Najlepsze" : "Najnowsze"}
            </button>
          ))}
        </div>

        {error && status !== "error" && (
          <p className="text-yellow-200 text-sm">{error}</p>
        )}

        {status === "loading" && <p className="text-white/60 py-12">Ładowanie…</p>}

        {status === "error" && (
          <div className="text-white/60 py-16 text-center flex flex-col gap-3">
            <p className="text-yellow-200">{error}</p>
            <p className="text-sm">
              Reszta gry działa normalnie —{" "}
              <Link href="/categories" className="underline text-[#00d4ff]">
                wbudowane kategorie
              </Link>{" "}
              nie potrzebują niczego z tego.
            </p>
          </div>
        )}

        {status === "ready" && categories.length === 0 && (
          <div className="text-white/60 py-16 text-center flex flex-col gap-3">
            <p>Nic tu jeszcze nie ma.</p>
            <p>
              <Link href="/community/create" className="underline text-[#00d4ff]">
                Utwórz pierwszą.
              </Link>
            </p>
          </div>
        )}

        {/* Switching sort takes a couple of seconds against a cold database.
            Leaving the previous results at full strength means you can vote on
            a row that's about to be replaced, so they're visibly stale and
            inert until the new page arrives. */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 transition-opacity ${
            status === "loading" && categories.length > 0
              ? "opacity-40 pointer-events-none"
              : ""
          }`}
          aria-busy={status === "loading"}
        >
          {categories.map((category) => {
            const added = communityCategoryId(category.id) in mine;

            return (
              <div
                key={category.id}
                className="bg-gray-900/60 border-2 border-[#00d4ff]/40 rounded-lg overflow-hidden flex flex-col"
              >
                <div className="grid grid-cols-4 gap-px bg-black/40 h-24">
                  {category.previewImageUrls.map((url) => (
                    <img
                      key={url}
                      src={url}
                      alt=""
                      loading="lazy"
                      className="w-full h-24 object-cover bg-black"
                    />
                  ))}
                </div>

                <div className="p-4 flex flex-col gap-3 flex-1">
                  <div>
                    <Link
                      href={`/community/${category.id}`}
                      className="text-xl font-bold text-white hover:text-[#00d4ff]"
                    >
                      {category.name}
                    </Link>
                    <p className="text-white/50 text-sm">
                      elementy: {category.itemCount}
                      {category.isOwner ? " · twoja" : ""}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 mt-auto">
                    <button
                      onClick={() => onVote(category.id, 1)}
                      disabled={category.isOwner}
                      aria-label="Głos za"
                      className={`px-2 py-1 rounded text-sm disabled:opacity-30 ${
                        category.myVote === 1
                          ? "bg-[#00d4ff] text-black"
                          : "bg-gray-800 text-white/70 hover:bg-gray-700"
                      }`}
                    >
                      ▲
                    </button>
                    <span className="font-bold text-white min-w-[2ch] text-center">
                      {category.score}
                    </span>
                    <button
                      onClick={() => onVote(category.id, -1)}
                      disabled={category.isOwner}
                      aria-label="Głos przeciw"
                      className={`px-2 py-1 rounded text-sm disabled:opacity-30 ${
                        category.myVote === -1
                          ? "bg-red-500 text-black"
                          : "bg-gray-800 text-white/70 hover:bg-gray-700"
                      }`}
                    >
                      ▼
                    </button>

                    <div className="flex-1" />

                    {added ? (
                      <button
                        onClick={() => removeCategory(category.id)}
                        className="text-sm px-3 py-1 rounded bg-gray-700 text-white/80 hover:bg-gray-600"
                      >
                        Usuń
                      </button>
                    ) : (
                      <button
                        onClick={() => onAdd(category)}
                        disabled={pending === category.id}
                        className="text-sm px-3 py-1 rounded bg-[#00d4ff] text-black font-semibold disabled:opacity-50"
                      >
                        {pending === category.id ? "Dodawanie…" : "Dodaj do mojej gry"}
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => onReport(category.id)}
                    className="text-xs text-white/40 hover:text-red-300 self-start"
                  >
                    Zgłoś
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {status === "ready" && hasMore && (
          <div className="flex justify-center pt-2">
            <FloorButton
              variant="rectangular"
              className="font-semibold"
              disabled={loadingMore}
              onClick={loadMore}
            >
              {loadingMore ? "Ładowanie…" : "Wczytaj więcej"}
            </FloorButton>
          </div>
        )}

        {status === "ready" && !hasMore && categories.length > 0 && (
          <p className="text-white/40 text-sm text-center pt-2">
            To już wszystkie ({categories.length}).
          </p>
        )}

        {Object.keys(mine).length > 0 && (
          <p className="text-white/60 text-sm border-t border-white/10 pt-4">
            Kategorie społeczności wczytane w tej przeglądarce:{" "}
            {Object.keys(mine).length}. Pojawią się na liście kategorii w{" "}
            <Link href="/presenter" className="underline text-[#00d4ff]">
              panelu prowadzącego
            </Link>
            .
          </p>
        )}
      </div>
    </FloorPageLayout>
  );
}
