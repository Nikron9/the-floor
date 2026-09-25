"use client";

import FloorPageLayout from "./components/FloorPageLayout";
import FloorButton from "./components/FloorButton";
import FloorLogo from "./components/FloorLogo";
import Link from "next/link";

export default function HomePage() {
  return (
    <FloorPageLayout>
      <div className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center p-8 md:p-20">
        <div className="max-w-3xl w-full flex flex-col items-center text-center gap-10">
          <div className="flex flex-col items-center gap-6">
            <h1>
              <FloorLogo size="lg" />
            </h1>
            <p className="text-xl md:text-2xl glow-text uppercase tracking-[0.2em]">
              Fanowska gra online
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/presenter" prefetch={false}>
              <FloorButton variant="rectangular" className="btn-primary">
                Zacznij grać
              </FloorButton>
            </Link>
            <Link href="/categories" prefetch={false}>
              <FloorButton variant="rectangular">Przeglądaj kategorie</FloorButton>
            </Link>
            <Link href="/about" prefetch={false}>
              <FloorButton variant="rectangular">O grze</FloorButton>
            </Link>
          </div>
        </div>
      </div>
    </FloorPageLayout>
  );
}
