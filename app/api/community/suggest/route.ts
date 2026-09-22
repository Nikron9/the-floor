import { Output, generateText } from "ai";
import { z } from "zod";

import { LIMITS, SUGGEST_MODELS, hasAiGateway } from "@/lib/community/config";
import { fail, handle, json, readJson } from "@/lib/community/http";
import { cleanText, parseCategoryName } from "@/lib/community/validate";

/**
 * "Give me a category name, get 50 things that belong in it."
 *
 * Cheap in tokens -- 50 short strings is around 1.5K output tokens, a fraction
 * of a cent -- but the constraint isn't spend. AI Gateway's free tier
 * rate-limits hard, and the included $5 monthly credit does not lift that; only
 * buying credits does, which permanently ends the monthly grant. So this is
 * built as a convenience that is allowed to fail: it tries several models, and
 * when none answer the page falls back to typing or pasting a list, which is
 * what the rest of the flow is designed around anyway.
 */

const Suggestions = z.object({
  items: z
    .array(
      z.object({
        name: z
          .string()
          .describe("The answer a player shouts when they see the picture."),
        alternatives: z
          .array(z.string())
          .describe(
            "Other phrasings to accept. Nicknames, plurals, the short form. Empty is fine."
          ),
      })
    )
    .describe("Distinct, well-known members of the category."),
});

const SYSTEM = [
  "You suggest answers for a picture round in a party game modelled on the TV",
  "show The Floor. A player sees one image at a time and has to shout the name.",
  "",
  "Good suggestions are:",
  "- instantly recognisable from a single photograph",
  "- concrete and specific, never a category or an abstract idea",
  "- easy to find a clear, well-lit picture of",
  "- varied in difficulty, from gimmes to a few deep cuts",
  "",
  "Skip anything that is only identifiable from text on the image, anything",
  "adult or graphic, and any real private individual. Use the common name",
  "people actually say out loud, not a formal or Latin one.",
  "",
  "The players are Polish. Write every name and alternative in Polish, the",
  "way a Polish player would shout it. Keep brands, people and titles in the",
  "form used in Poland, and add the English original as an alternative when",
  "it differs.",
].join("\n");

export async function POST(request: Request) {
  return handle(async () => {
    if (!hasAiGateway()) {
      return fail(
        "Propozycje AI nie są skonfigurowane. Ustaw AI_GATEWAY_API_KEY albo wpisz elementy samodzielnie.",
        503
      );
    }

    const body = await readJson(request);
    const name = parseCategoryName(body.name);
    const count = Math.min(
      Math.max(Number(body.count) || 50, 10),
      LIMITS.maxItemsPerCategory
    );

    // Try each model in turn. The free tier's rate limit is per model and
    // low, so the second one frequently answers when the first won't.
    let output: z.infer<typeof Suggestions> | undefined;
    let lastError = "";

    for (const model of SUGGEST_MODELS) {
      try {
        ({ output } = await generateText({
          model,
          // The gateway's own retry is the wrong tool here: waiting out one
          // model's limit is slower than asking the next one.
          maxRetries: 0,
          system: SYSTEM,
          output: Output.object({ schema: Suggestions }),
          prompt: `Kategoria: "${name}"\n\nZaproponuj ${count} elementów.`,
        }));
        break;
      } catch (error) {
        lastError = error instanceof Error ? error.message : String(error);

        // Always log the original. Translating errors into friendly prose and
        // then discarding them left nothing to diagnose from when the friendly
        // version turned out to be the wrong guess.
        console.error(`[community] AI Gateway (${model}):`, lastError);

        const retryable =
          /rate.?limit|do not have access|unavailable|timeout|overload/i.test(
            lastError
          );
        if (!retryable) throw error;
      }
    }

    if (!output) {
      // Gateway problems here are account state, not a bug in the request, and
      // "something went wrong" sends people looking in the wrong place.
      if (/credit card|verification/i.test(lastError)) {
        return fail(
          "AI Gateway wymaga podpiętej karty, zanim zacznie obsługiwać żądania. " +
            "Dodaj ją w panelu Vercel w sekcji AI Gateway albo wpisz " +
            "elementy samodzielnie.",
          503
        );
      }

      return fail(
        "AI Gateway ogranicza teraz liczbę żądań — darmowy plan pozwala na " +
          "bardzo niewiele. Odczekaj minutę i spróbuj ponownie albo wpisz " +
          "elementy samodzielnie.",
        503
      );
    }

    // The model is usually well behaved, but it is not a validator: dedupe and
    // trim here so the create page can render the result without thinking.
    const seen = new Set<string>();
    const items = output.items
      .map((item) => ({
        name: cleanText(item.name),
        alternatives: (item.alternatives ?? [])
          .map(cleanText)
          .filter(Boolean)
          .slice(0, LIMITS.maxAlternativesPerItem),
      }))
      .filter((item) => {
        if (!item.name || item.name.length > LIMITS.maxItemNameLength) {
          return false;
        }
        const key = item.name.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .slice(0, count);

    return json({ items });
  });
}
