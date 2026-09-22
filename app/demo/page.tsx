"use client";
import { useSearchParams } from "next/navigation";
import { CategoryId } from "../data";
import Round from "../projector/round";
import { Suspense } from "react";

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
