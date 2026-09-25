import { serperApiKey } from "@/lib/shared/config";
import { handle, json } from "@/lib/shared/http";

/**
 * What this deployment can actually do.
 *
 * The image editor uses it to decide whether to offer web image search at
 * all -- better than showing a button that answers 503, and
 * better than hard-coding the assumption that every deployment is configured
 * the same way. Deliberately says nothing about *how* anything is configured.
 */
export async function GET() {
  return handle(async () =>
    json({
      webImageSearch: Boolean(serperApiKey()),
    })
  );
}
