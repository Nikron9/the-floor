"use client";
import { useSearchParams } from "next/navigation";
import { CategoryId } from "../data";
import Round from "../projector/round";
import { Suspense } from "react";
import { MIXED_CATEGORY_ID } from "../categories/registry";

/** Nobody gets through more than this in a 2 x 45 s duel. */
const MIXED_ROUND_LIMIT = 100;

export function Demo() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") as CategoryId | undefined;

  if (!category) {
    return <div>Nie podano kategorii</div>;
  }

  return (
    <Round
      category={category}
      challenger={{
        person: "Pretendent",
        category,
        hasPlayed: true,
        isStillInTheGame: true,
      }}
      defender={{
        person: "Obrońca",
        category,
        hasPlayed: true,
        isStillInTheGame: true,
      }}
      onFinish={() => window.close()}
      // A one-off round from the presenter menu draws examples in random
      // order; a full game keeps each category's fixed order.
      shuffle
      limit={category === MIXED_CATEGORY_ID ? MIXED_ROUND_LIMIT : undefined}
    />
  );
}

export default function DemoPage({ params }: { params: Promise<any> }) {
  return (
    <Suspense fallback={<div>Ładowanie...</div>}>
      <Demo />
    </Suspense>
  );
}
