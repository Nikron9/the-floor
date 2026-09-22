import type { Metadata } from "next";
import { Montserrat, Cookie } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import BuyMeACoffeeButton from "./components/BuyMeACoffeeButton";
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});
const cookie = Cookie({
  variable: "--font-cookie",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Zagraj w The Floor online – darmowa gra teleturniejowa",
    template: "%s | The Floor",
  },
  description:
    "Zagraj w The Floor online za darmo! Fanowska wersja przebojowego teleturnieju. Wyzywaj znajomych na pojedynki wiedzy, zdobywaj kategorie i walcz o kontrolę nad całą planszą.",
  keywords: [
    "the floor gra",
    "the floor online",
    "gra the floor",
    "zagraj w the floor",
    "teleturniej online",
    "gra teleturniejowa",
    "quiz online",
    "gra w pojedynki",
    "gra imprezowa",
    "kategorie the floor",
    "play the floor",
    "play the floor online",
    "the floor game",
    "the floor online",
    "the floor game show",
    "the floor trivia game",
    "rob lowe the floor",
    "the floor free game",
    "online game show",
    "trivia game",
    "the floor web game",
    "the floor browser game",
    "play the floor game show",
    "the floor game online",
    "the floor trivia",
    "the floor categories",
    "the floor duels",
  ],
  authors: [{ name: "The Floor Fan Game" }],
  creator: "The Floor Fan Game",
  publisher: "The Floor Fan Game",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    apple: { sizes: "180x180", type: "image/png", url: "/apple-touch-icon.png" },
    icon: { sizes: "192x192", type: "image/png", url: "/icon-192.png" },
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "pl_PL",
    url: "https://the-floor-game.vercel.app",
    siteName: "The Floor - Fan Game",
    title: "Zagraj w The Floor online – darmowa fanowska gra teleturniejowa",
    description:
      "Zagraj w The Floor online za darmo! Fanowska wersja przebojowego teleturnieju. Wyzywaj znajomych na pojedynki wiedzy i walcz o kontrolę nad całą planszą.",
    images: [
      {
        url: "https://the-floor-game.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "The Floor – graj online (gra fanowska)",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zagraj w The Floor online – darmowa fanowska gra teleturniejowa",
    description:
      "Zagraj w The Floor online za darmo! Fanowska wersja przebojowego teleturnieju. Wyzywaj znajomych na pojedynki wiedzy i walcz o kontrolę nad całą planszą.",
    images: ["https://the-floor-game.vercel.app/og-image.png"],
    creator: "@thefloor",
  },
  alternates: {
    canonical: "https://the-floor-game.vercel.app",
  },
  category: "Games",
  classification: "Game Show, Trivia Game, Online Game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: "The Floor - Fan Game",
    description:
      "Zagraj w The Floor online za darmo! Fanowska wersja przebojowego teleturnieju. Wyzywaj znajomych na pojedynki wiedzy, zdobywaj kategorie i walcz o kontrolę nad całą planszą.",
    applicationCategory: "Game",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    genre: ["Trivia", "Game Show", "Quiz", "Teleturniej"],
    gamePlatform: ["Web Browser"],
    publisher: {
      "@type": "Organization",
      name: "The Floor Fan Game",
    },
    copyrightHolder: {
      "@type": "Person",
      name: "Fan Creator",
    },
    copyrightNotice:
      "This is a fan-made game. The Floor is a trademark of Fox Broadcasting Company.",
    basedOn: {
      "@type": "TVSeries",
      name: "The Floor",
      description:
        "The Floor is an American game show based on the Dutch game show of the same name, hosted by Rob Lowe and premiered on January 2, 2024, on Fox.",
    },
    keywords:
      "the floor gra, gra the floor, zagraj w the floor, teleturniej online, quiz online, play the floor, play the floor online, the floor game, the floor online, the floor game show, the floor trivia game, rob lowe the floor, the floor free game, online game show, trivia game",
  };

  return (
    <html lang="pl">
      <body
        className={`${montserrat.variable} ${cookie.variable} antialiased`}
      >
        <Script
          id="structured-data"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <BuyMeACoffeeButton />
        <Analytics />
      </body>
    </html>
  );
}
