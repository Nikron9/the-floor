"use client";

import Link from "next/link";
import FloorPageLayout from "../../components/FloorPageLayout";
import FloorButton from "../../components/FloorButton";

const REPO_URL = "https://github.com/campavao/the-floor";
const NEW_ISSUE_URL = `${REPO_URL}/issues/new`;
const COMPARE_URL = `${REPO_URL}/compare`;

const IMAGE_EXAMPLE_SNIPPET = `const SeaCreaturesCategory: CategoryMetadata = {
  name: "Stworzenia morskie",
  folder: "sea-creatures",
  examples: [
    {
      name: "Ośmiornica",
      image: "octopus.png",
      alternatives: ["Octopus"],
    },
    // ...more entries
  ],
};`;

const TEXT_EXAMPLE_SNIPPET = `const FamousQuotesCategory: CategoryMetadata = {
  name: "Słynne cytaty",
  folder: "famous-quotes",
  examples: [
    {
      name: "Neil Armstrong",
      text: "To mały krok dla człowieka...",
      alternatives: [],
    },
    // ...more entries
  ],
};`;

const REGISTER_SNIPPET = `// 1. Dodaj do unii Category (klucz = nazwa kategorii)
export type Category =
  | "Pokémony"
  // ...
  | "Stworzenia morskie";

// 2. Zarejestruj w CATEGORY_METADATA
export const CATEGORY_METADATA: Record<Category, CategoryMetadata> = {
  // ...
  "Stworzenia morskie": SeaCreaturesCategory,
};`;

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="bg-gray-950 border-2 border-[#00d4ff]/40 rounded-md p-4 overflow-x-auto text-sm md:text-base">
      <code className="text-[#00d4ff] font-mono whitespace-pre">{children}</code>
    </pre>
  );
}

export default function ContributeCategoriesPage() {
  return (
    <FloorPageLayout>
      <div className="relative z-10 w-full h-full overflow-y-auto flex flex-col items-center p-8 md:p-20">
        <div className="max-w-4xl w-full space-y-8">
          <div className="text-center mb-8">
            <h1 className="text-5xl md:text-7xl font-black metallic-text mb-4">
              DODAJ KATEGORIĘ
            </h1>
            <p className="text-xl md:text-2xl glow-text">
              Chcesz zobaczyć swój ulubiony temat w The Floor? Otwórz pull
              request!
            </p>
          </div>

          <div className="space-y-6 text-lg leading-relaxed">
            <section className="bg-black/60 p-6 md:p-8 border-2 border-white/20">
              <h2 className="text-3xl font-bold mb-4 glow-text">
                Jak to działa
              </h2>
              <p className="mb-4">
                Kategorie są zdefiniowane bezpośrednio w kodzie źródłowym. Aby
                dodać nową, zrób forka repozytorium, dodaj obrazki i dane, a
                następnie otwórz pull request. Po jego scaleniu kategoria
                będzie dostępna dla wszystkich.
              </p>
              <ol className="list-decimal list-inside space-y-2">
                <li>Zrób forka repozytorium na GitHubie</li>
                <li>
                  Dodaj pliki obrazków do{" "}
                  <code className="text-[#00d4ff] font-mono">
                    public/images/&lt;twój-folder&gt;/
                  </code>
                </li>
                <li>
                  Dodaj wpis kategorii w{" "}
                  <code className="text-[#00d4ff] font-mono">app/data.ts</code>
                </li>
                <li>Otwórz pull request</li>
              </ol>
            </section>

            <section className="bg-black/60 p-6 md:p-8 border-2 border-white/20">
              <h2 className="text-3xl font-bold mb-4 glow-text">
                Krok 1: Dodaj obrazki
              </h2>
              <p className="mb-4">
                Wrzuć pliki obrazków (najlepiej PNG, JPG lub WEBP) do nowego
                folderu w{" "}
                <code className="text-[#00d4ff] font-mono">public/images/</code>
                . Nazwa folderu powinna być pisana małymi literami w stylu kebab-case.
              </p>
              <CodeBlock>{`public/images/sea-creatures/
  octopus.png
  shark.png
  jellyfish.png`}</CodeBlock>
              <p className="mt-4 text-white/70 text-base">
                Wskazówka: postaw na przezroczyste tło i proporcje zbliżone do
                kwadratu, żeby obrazki dobrze wyglądały w siatce.
              </p>
            </section>

            <section className="bg-black/60 p-6 md:p-8 border-2 border-white/20">
              <h2 className="text-3xl font-bold mb-4 glow-text">
                Krok 2: Zdefiniuj kategorię
              </h2>
              <p className="mb-4">
                W pliku{" "}
                <code className="text-[#00d4ff] font-mono">app/data.ts</code>,
                utwórz nową stałą{" "}
                <code className="text-[#00d4ff] font-mono">CategoryMetadata</code>.
                Każdy przykład ma pole{" "}
                <code className="text-[#00d4ff] font-mono">name</code>{" "}
                (odpowiedź), zasób (nazwę pliku w{" "}
                <code className="text-[#00d4ff] font-mono">image</code> lub
                tekst w <code className="text-[#00d4ff] font-mono">text</code>)
                oraz tablicę{" "}
                <code className="text-[#00d4ff] font-mono">alternatives</code>{" "}
                z akceptowanymi alternatywnymi odpowiedziami.
              </p>

              <p className="mt-4 mb-2 font-semibold" style={{ color: "#00d4ff" }}>
                Kategoria obrazkowa:
              </p>
              <CodeBlock>{IMAGE_EXAMPLE_SNIPPET}</CodeBlock>

              <p className="mt-4 mb-2 font-semibold" style={{ color: "#00d4ff" }}>
                Kategoria tekstowa (bez obrazków):
              </p>
              <CodeBlock>{TEXT_EXAMPLE_SNIPPET}</CodeBlock>
            </section>

            <section className="bg-black/60 p-6 md:p-8 border-2 border-white/20">
              <h2 className="text-3xl font-bold mb-4 glow-text">
                Krok 3: Zarejestruj ją
              </h2>
              <p className="mb-4">
                Dodaj swoją kategorię do unii typu{" "}
                <code className="text-[#00d4ff] font-mono">Category</code> oraz do
                rekordu{" "}
                <code className="text-[#00d4ff] font-mono">
                  CATEGORY_METADATA
                </code>{" "}
                na końcu pliku.
              </p>
              <CodeBlock>{REGISTER_SNIPPET}</CodeBlock>
            </section>

            <section className="bg-black/60 p-6 md:p-8 border-2 border-white/20">
              <h2 className="text-3xl font-bold mb-4 glow-text">
                Krok 4: Otwórz pull request
              </h2>
              <p className="mb-4">
                Wypchnij swoją gałąź do forka i otwórz PR do gałęzi{" "}
                <code className="text-[#00d4ff] font-mono">main</code>. W opisie
                PR podaj nazwę kategorii i krótki opis przykładów. Przejrzymy go
                i scalimy.
              </p>
              <p className="text-white/70 text-base">
                Nie czujesz się pewnie z kodem? Zamiast tego otwórz issue z
                pomysłem na kategorię i listą przykładów — resztą zajmiemy się
                my.
              </p>
            </section>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            <a href={COMPARE_URL} target="_blank" rel="noopener noreferrer">
              <FloorButton variant="rectangular">Otwórz pull request</FloorButton>
            </a>
            <a href={NEW_ISSUE_URL} target="_blank" rel="noopener noreferrer">
              <FloorButton variant="rectangular">Zaproponuj przez issue</FloorButton>
            </a>
            <Link href="/categories" prefetch={false}>
              <FloorButton variant="rectangular">Wróć do kategorii</FloorButton>
            </Link>
          </div>
        </div>
      </div>
    </FloorPageLayout>
  );
}
