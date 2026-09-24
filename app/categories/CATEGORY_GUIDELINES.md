# Category guidelines

The game shows examples **in exactly the order they appear in the file** (it
only shuffles with `?debug=true`). The `examples` order is therefore the
difficulty curve of the whole duel. These rules follow directly from how a
round works:

- each player has **45 s** (set in `app/projector/round.tsx`),
- correct answer: the answer is revealed for 1 s, the clock stops, and the turn passes to the opponent,
- pass: the answer shows for 3 s, **the passer's clock keeps running**, and the same player continues,
- both players play through **one shared list**. If it runs out, the round
  ends immediately and whoever has more time left wins. That is unfair, so a
  list must never run out.

## 1. Length

| | 45 s per player | 30 s per player |
|---|---|---|
| minimum | 45 | 40 |
| target | 55–60 | 50 |

A fast duel uses roughly 35–45 examples (1.5–2.5 s each, reveal included).
Everything past that is reserve for exceptionally quick players.

## 2. What makes an example easy

Difficulty is the product of three things. A weakness in any one of them
makes an example hard:

1. **Recognisability in Poland.** Judge it for the average Polish player, not
   worldwide. Madonna comes before Taylor Swift, grzaniec before pastel de nata.
2. **Picture clarity.** How long until the "aha". A photo of steaming mugs
   could be tea, so grzaniec is not at the very top despite being popular.
3. **Ease of saying the answer.** A short, obvious, single name ("Kebab") is
   easier than a long or ambiguous one ("Kiełbaska w bułce").

## 3. Order: four zones

| Positions | Zone | Test |
|---|---|---|
| 1–15 | **Warm-up** | anyone gets it in ~2 s, including someone outside the topic |
| 16–35 | **Core** | most people get it in ~3–4 s |
| 36–50 | **Extra time** | someone who knows the topic a little gets it |
| 51+ | **Reserve** | hard but guessable, never expert-only trivia |

Order within a zone can be loose. What matters is that the zones go from
easiest to hardest.

## 4. Fairness in a duel

Players take consecutive examples in turn, so:

- **Neighbours should be equally hard.** Don't put a very hard example between
  two easy ones, or luck decides who gets it.
- **Mix subtypes.** Don't list every mushroom and then every animal. A run of
  similar items either gives the answer away or confuses players.
- **Keep look-alikes apart** (Kiełbaska z grilla / Kiełbaska w bułce), or
  better, keep only one of them.
- **One entry per franchise.** No parts 1, 2 and 3 of the same film.
- **Never alphabetical.** Enforced by `tests/categoryOrder.test.ts`.

## 5. Every example must be guessable

- If a typical player who knows the topic can't get it in ~5 s, **cut it**.
  A pass costs 3 s plus thinking time, so an impossible example punishes bad
  luck. It isn't a challenge.
- The picture must **not contain text that gives the answer away** (a title,
  logo or label).
- One clear subject, well visible, at least ~600 px on the long edge.

## 6. Names and answers

- `name` is **what a Polish player says first**: the Polish release title, the
  Polish name of a dish. Use a foreign name only when Poles actually say it
  that way (Hot dog, Kebab, Paella). `name` is shown to players, so it is Polish.
- `alternatives` holds the original title, abbreviations and colloquial names
  (`"Kiełbasa curry"` → `["Currywurst"]`, `"Jak wytresować smoka"` → `["Szczerbatek"]`).
- No duplicate alternatives. A test checks this, case-insensitively.

## 7. Age-dependent categories

If a category depends on age (cartoons, games, music), pick a target age
group, note it in a comment above `examples`, and judge recognisability for
that group.

## 8. Before adding

Read the first 15 entries aloud to someone outside the topic. If they get
stuck on more than 2–3, move those items further down.
