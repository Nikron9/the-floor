"use client";

import FloorPageLayout from "../components/FloorPageLayout";
import FloorButton from "../components/FloorButton";
import Link from "next/link";

export default function AboutPage() {
  return (
    <FloorPageLayout>
      <div className="relative z-10 w-full h-full overflow-y-auto flex flex-col items-center p-8 md:p-20">
        <div className="max-w-4xl w-full space-y-8">
          <div className="text-center mb-8">
            <h1 className="text-6xl md:text-8xl font-black metallic-text mb-4">
              THE FLOOR
            </h1>
            <p className="text-2xl md:text-3xl glow-text mb-4">
              Fanowska gra online
            </p>
          </div>

          <div className="space-y-6 text-lg md:text-xl leading-relaxed">
            <section className="bg-black/60 p-6 md:p-8 border-2 border-white/20">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 glow-text">
                O grze
              </h2>
              <p className="mb-4">
                To{" "}
                <strong className="glow-text">fanowska, nieoficjalna</strong>{" "}
                wersja online przebojowego teleturnieju <em>The Floor</em>{" "}
                stacji Fox, prowadzonego przez Roba Lowe&apos;a. Stworzona przez
                fana programu gra przeglądarkowa pozwala poczuć emocje The Floor
                bez wychodzenia z domu.
              </p>
              <p className="mb-4">
                Graj ze znajomymi, wyzywaj przeciwników na pojedynki wiedzy i
                walcz o kontrolę nad całą planszą — zupełnie jak w programie!
              </p>
            </section>

            <section className="bg-black/60 p-6 md:p-8 border-2 border-white/20">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 glow-text">
                Jak grać
              </h2>
              <ol className="list-decimal list-inside space-y-3">
                <li>
                  <strong>Przygotuj grę:</strong> Przejdź do panelu prowadzącego
                  i dodaj graczy wraz z ich kategoriami.
                </li>
                <li>
                  <strong>Rozpocznij grę:</strong> Kliknij &bdquo;Rozpocznij
                  grę&rdquo;, aby zacząć.
                </li>
                <li>
                  <strong>Wyzywaj przeciwników:</strong> Gracze na zmianę
                  wyzywają się nawzajem na pojedynki wiedzy jeden na jednego.
                </li>
                <li>
                  <strong>Zdobywaj terytorium:</strong> Zwycięzca każdego
                  pojedynku przejmuje terytorium przegranego.
                </li>
                <li>
                  <strong>Zdobądź planszę:</strong> Wygrywa ostatni gracz, który
                  pozostanie w grze!
                </li>
              </ol>
            </section>

            <section className="bg-black/60 p-6 md:p-8 border-2 border-white/20">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 glow-text">
                Wesprzyj projekt
              </h2>
              <p className="mb-4">
                The Floor: The Game jest całkowicie darmowa. Jeśli dobrze się
                bawisz i chcesz pomóc pokryć koszty hostingu, możesz wesprzeć
                projekt przez Buy Me a Coffee — każda pomoc się liczy.
              </p>
              <p>
                Kliknij przycisk{" "}
                <strong className="glow-text">Postaw mi kawę</strong> w prawym
                dolnym rogu strony albo odwiedź{" "}
                <a
                  href="https://buymeacoffee.com/campavao"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline glow-text"
                >
                  buymeacoffee.com/campavao
                </a>
                .
              </p>
            </section>

            <section className="bg-black/60 p-6 md:p-8 border-2 border-white/20">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 glow-text">
                Zastrzeżenie
              </h2>
              <p className="mb-4">
                <em>The Floor</em> jest znakiem towarowym Fox Broadcasting
                Company. Ta gra jest niezależnym projektem fanowskim i nie jest
                powiązana z Fox Broadcasting Company, Robem Lowe&apos;em ani
                żadną oficjalną produkcją The Floor, ani przez nich popierana.
              </p>
              <p>
                Gra służy wyłącznie celom rozrywkowym i jest całkowicie darmowa.
                Nie jest przeznaczona do użytku komercyjnego.
              </p>
            </section>

            <section className="bg-black/60 p-6 md:p-8 border-2 border-white/20">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 glow-text">
                O programie
              </h2>
              <p className="mb-4">
                <em>The Floor</em> to amerykański teleturniej oparty na
                holenderskim formacie o tej samej nazwie. Prowadzi go Rob Lowe,
                a premiera odbyła się 2 stycznia 2024 roku na antenie Fox.
              </p>
              <p>
                Uczestnicy, eksperci w różnych dziedzinach, wyzywają się na
                pojedynki jeden na jednego, a zwycięzca przejmuje całe
                terytorium przegranego. Uczestnik, który zdobędzie kontrolę nad
                całą planszą, wygrywa 250 000 dolarów.
              </p>
            </section>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            <Link href="/presenter" prefetch={false}>
              <FloorButton variant="rectangular">Zacznij grać</FloorButton>
            </Link>
            <Link href="/categories" prefetch={false}>
              <FloorButton variant="rectangular">Przeglądaj kategorie</FloorButton>
            </Link>
            <Link href="/" prefetch={false}>
              <FloorButton variant="rectangular">Strona główna</FloorButton>
            </Link>
          </div>
        </div>
      </div>
    </FloorPageLayout>
  );
}
