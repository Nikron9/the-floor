# The Floor

A fan-made, unofficial browser version of the Fox game show *The Floor*, in
Polish.

Everyone starts on one tile of a grid, each defending a category. You challenge
a neighbour, you both get 45 seconds on their subject, and the winner takes
their territory. Keep winning and you take the whole floor.

Play it at **[the-floor-smoky.vercel.app](https://the-floor-smoky.vercel.app)**,
or run it yourself:

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

## The two screens

The game runs as **two pages at once**:

| Page | Who looks at it | What it does |
| --- | --- | --- |
| `/presenter` | you, the host | players and their categories, the draw, round controls, the answers |
| `/projector` | everyone else | the board, the pictures or prompts, timers, the countdown |

They stay in sync over `BroadcastChannel`, which means **both windows must be
in the same browser on the same machine.** Open the projector from the
presenter and drag it onto the TV. Two separate devices will not talk to each
other.

## Game modes

All three start from the presenter menu:

- **Rozpocznij grę** — the full game: board, draw, duels until one player
  owns the floor. Examples play in each category's fixed order (easiest
  first).
- **Szybki pojedynek** — one duel in a chosen category, in the category's
  fixed order or, if the host ticks *Losowa kolejność*, shuffled
  (`/demo?category=…&shuffle=1`).
- **Miks kategorii** — one duel on random pictures from every image category
  (at most 100 per round).

Before each round the projector shows who plays whom, the category, whether it
is pictures or text, what to answer, and the rules (45 s each, a correct
answer passes the clock, a pass costs 3 s).

`/categories` browses every category with all its accepted answers; `/about`
explains the game to players.

## Adding a category

**1. Drop your images in a new folder** under `public/images/`, named in
lowercase kebab-case:

```
public/images/sea-creatures/
  octopus.jpg
  shark.jpg
  jellyfish.jpg
```

Pictures must be recognisable at a glance on a projector. Don't worry about
file size — drop the originals in and run:

```bash
node scripts/optimize-images.mjs
```

It caps the longest edge at 2048px and re-encodes in place, keeping filenames
and formats. `npm test` fails if an oversized image slips through.

Record where every picture came from in `public/credits/<folder>.txt`, one line
per file: `file.jpg — Name: author, licence, source URL`.

**2. Add `app/categories/data/<folder>.ts`** with a `CategoryMetadata` const,
then register it in `app/data.ts`: an import, the name added to the `Category`
union, and an entry in `CATEGORY_METADATA`. Copy a neighbouring file:

```ts
import type { CategoryMetadata } from "./types";

export const SeaCreaturesCategory: CategoryMetadata = {
  name: "Stworzenia morskie",
  folder: "sea-creatures",
  // Easiest first -- never alphabetical.
  examples: [
    { pl: "Ośmiornica", plAlt: ["Ośmiorniczka"], properEn: "Octopus", image: "octopus.jpg" },
  ],
};
```

Answers go in four optional slots, in priority order: `pl` (the Polish word),
`plAlt` (other Polish ways to say it), `properPl` (proper name as used in
Poland) and `properEn` (English/original name). At least one of `pl`,
`properPl`, `properEn` is required; the first one set is the main answer shown
on the projector, and the host panel lists all of them in that order.

Categories can use `text:` instead of `image:` for word or number prompts (see
`math.ts`, `european-capitals.ts`, `proverbs.ts`). An optional `instruction`
overrides the generic pre-round prompt, e.g. *"Na ekranie pojawi się nazwa
państwa. Podaj jego stolicę."*

**Order matters:** the full game shows examples in file order, so the list is
the round's difficulty curve. Easiest to guess first, never alphabetical, at
least 45 examples. The full rules are in
[`app/categories/CATEGORY_GUIDELINES.md`](app/categories/CATEGORY_GUIDELINES.md).

UI text and answers are Polish; code, comments, docs and credits are English.

### One trap worth knowing about

**Filenames are case-sensitive in production.** Vercel builds on Linux;
Windows and macOS don't care about case, so `folder: "fruits"` pointing at
`public/images/Fruits/` looks perfect on your laptop and shows broken images to
everyone else. `npm test` catches it before you push, on any operating system.

## Checks

```bash
npm test        # category data, answers, order, image assets, game logic
npm run build   # production build
```

CI runs both on every pull request, deliberately on Linux so casing bugs
surface there instead of in production.

## Replacing pictures in built-in categories

`/categories` → a category → **Podmień obrazki** lets the admin, or anyone with
the shared PIN (set in `/admin`), replace a picture with search, link, upload
and an in-browser crop / erase editor. Replacements are stored in Postgres
(`curated_image_overrides`, see `lib/curated/schema.sql`) and layered over
`public/images/` at runtime, so deploys never overwrite them. If a later deploy
changes a replaced file, the replacement still wins and the admin page flags
it. Code: `lib/curated/`, `lib/shared/`, `app/api/curated/`. Setup and
environment variables: [SETUP.md](SETUP.md).

## Built with

Next.js and Tailwind, deployed on Vercel. The game itself has no database, no
accounts and no server — the game state lives in your browser. Only the picture
editor uses Postgres (and optionally Cloudflare R2); without those configured,
the rest of the site is unaffected.

## Disclaimer

*The Floor* is a trademark of Fox Broadcasting Company. This is an independent
fan project, not affiliated with or endorsed by Fox, Rob Lowe, or anyone
involved in the actual show. Free to play, no commercial use intended.
