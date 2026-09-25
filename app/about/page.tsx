import type { ReactNode } from "react";

import FloorPageLayout from "../components/FloorPageLayout";

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="neon-panel p-6 md:p-8 flex flex-col gap-4 text-base md:text-lg leading-relaxed text-white/85">
      <h2
        className="text-2xl md:text-3xl font-bold uppercase tracking-wide glow-text"
        style={{ color: "var(--color-neon)" }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

const STEPS = [
  ["Dodaj graczy", "W panelu prowadzącego wpisz imiona i przydziel każdemu kategorię."],
  ["Otwórz projektor", "Plansza wyświetla się w osobnym oknie — najlepiej na telewizorze albo rzutniku."],
  ["Losuj pojedynki", "Wylosowany gracz wyzywa sąsiada. Przed startem ekran pokazuje, czy będą obrazki czy tekst i co trzeba odpowiedzieć."],
  ["Walcz z czasem", "Każdy ma 45 sekund. Dobra odpowiedź przekazuje zegar rywalowi, pas kosztuje 3 sekundy."],
  ["Przejmij planszę", "Zwycięzca zabiera pola przegranego. Wygrywa ten, kto zostanie sam na całej planszy."],
] as const;

export default function AboutPage() {
  return (
    <FloorPageLayout back>
      <div className="w-full max-w-4xl mx-auto px-6 pb-16 pt-6 flex flex-col gap-6">
        <div className="flex flex-col items-center gap-3 mb-2 text-center">
          <h1
            className="text-4xl md:text-5xl font-bold uppercase tracking-wide glow-text"
            style={{ color: "var(--color-neon)" }}
          >
            O grze
          </h1>
          <p className="text-sm md:text-base uppercase tracking-[0.25em] text-white/70">
            Fanowska wersja teleturnieju do grania w domu
          </p>
        </div>

        <Panel title="Czym jest ta gra">
          <p>
            To <strong className="text-white">nieoficjalna, fanowska</strong> wersja
            teleturnieju <em>The Floor</em>. Prowadzący steruje grą z komputera,
            a plansza i pojedynki wyświetlają się na drugim ekranie — tak jak w
            studiu, tylko w salonie.
          </p>
        </Panel>

        <Panel title="Jak grać">
          <ol className="flex flex-col gap-3">
            {STEPS.map(([title, text], index) => (
              <li key={title} className="flex gap-4 items-start">
                <span className="btn-glow rectangular !px-0 !py-0 w-9 h-9 shrink-0 flex items-center justify-center text-base">
                  {index + 1}
                </span>
                <p>
                  <strong className="text-white">{title}.</strong> {text}
                </p>
              </li>
            ))}
          </ol>
        </Panel>

        <Panel title="Tryby">
          <ul className="flex flex-col gap-2">
            <li>
              <strong className="text-white">Pełna gra</strong> — plansza, losowanie i
              pojedynki aż do ostatniego gracza.
            </li>
            <li>
              <strong className="text-white">Szybki pojedynek</strong> — jeden pojedynek
              w wybranej kategorii, od najłatwiejszych albo w losowej kolejności.
            </li>
            <li>
              <strong className="text-white">Miks kategorii</strong> — pojedynek na losowych
              obrazkach ze wszystkich kategorii.
            </li>
          </ul>
        </Panel>

        <Panel title="Zastrzeżenie">
          <p>
            <em>The Floor</em> jest znakiem towarowym Fox Broadcasting Company. Ta
            gra jest niezależnym projektem fanowskim, niepowiązanym z Fox, Robem
            Lowe&apos;em ani żadną oficjalną produkcją programu. Jest darmowa i
            służy wyłącznie rozrywce.
          </p>
        </Panel>
      </div>
    </FloorPageLayout>
  );
}
