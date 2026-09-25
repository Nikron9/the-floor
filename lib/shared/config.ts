/**
 * How the image editor for the built-in categories is wired up, and what it
 * refuses to do. It stays inside free tiers: Postgres (Neon) holds the
 * override rows and any uploaded pictures, optionally Cloudflare R2.
 *
 * With no credentials at all it still runs -- it writes to disk under
 * `.community-dev/` and `public/community-dev/` (names kept from the removed
 * community feature so existing local data keeps working). That path is
 * dev-only and refuses to start in production.
 */

/**
 * Thrown when the tool is deployed but its storage isn't set up yet.
 *
 * Distinct from a genuine failure so the API can answer 503 with the actual
 * missing variables instead of a generic "something went wrong" -- the site
 * sits in exactly this state between merging and provisioning.
 */
export class NotConfigured extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotConfigured";
  }
}

export const LIMITS = {
  /** Anything smaller looks soft on a 1080p projector. */
  minSourceImageEdge: 600,
  /**
   * Long edge after normalisation. The projector is 1080p, so this leaves
   * headroom without paying for it: `scripts/bench-image-size.mjs` measures
   * 1600/80 at ~129 KB average across a sample of real Commons photos, which
   * lines up with the 135 KB average of the curated pool and works out to
   * ~6.3 MB per 50-item category -- about 1,600 categories inside R2's free
   * 10 GB. Dropping to 1280/78 roughly halves that if it ever matters.
   */
  storedImageMaxEdge: 1600,
  storedImageQuality: 80,
  /** Refuse to even fetch something this big -- it's not a photo, it's a mistake. */
  maxSourceImageBytes: 25 * 1024 * 1024,

  /** The shared editing PIN -- see `lib/shared/pin.ts`. */
  editPinMinLength: 4,
  editPinMaxLength: 8,

  /**
   * Wrong-PIN budget. Five tries every fifteen minutes puts a 4-digit PIN
   * about ten days of nonstop guessing away on average, and costs whoever
   * mistyped it a short wait. The counter lives in the database, so it holds
   * across serverless instances and parallel requests.
   */
  pinAttemptsPerWindow: 5,
  pinAttemptWindowMinutes: 15,

  /**
   * Objects younger than this are never swept, even with nothing pointing at
   * them: an upload in flight is written before the row that references it.
   */
  orphanGraceHours: 24,

  /**
   * Ceiling on deletions per cleanup run. A bug that miscomputes "unreferenced"
   * should cost a bounded number of images, not the bucket.
   */
  maxDeletesPerRun: 500,
} as const;

const trimmed = (value: string | undefined) => {
  const next = value?.trim();
  return next ? next : undefined;
};

export const r2Config = () => {
  const accountId = trimmed(process.env.R2_ACCOUNT_ID);
  const accessKeyId = trimmed(process.env.R2_ACCESS_KEY_ID);
  const secretAccessKey = trimmed(process.env.R2_SECRET_ACCESS_KEY);
  const bucket = trimmed(process.env.R2_BUCKET);
  const publicBaseUrl = trimmed(process.env.R2_PUBLIC_BASE_URL);

  if (
    !accountId ||
    !accessKeyId ||
    !secretAccessKey ||
    !bucket ||
    !publicBaseUrl
  ) {
    return undefined;
  }

  return {
    accountId,
    accessKeyId,
    secretAccessKey,
    bucket,
    publicBaseUrl: publicBaseUrl.replace(/\/+$/, ""),
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  };
};

/**
 * Optional. Unlocks Google image results for branded and pop-culture items
 * that free-licence archives don't carry. 2,500 searches a month are free.
 */
export const serperApiKey = () => trimmed(process.env.SERPER_API_KEY);

export const databaseUrl = () =>
  trimmed(process.env.DATABASE_URL) ?? trimmed(process.env.POSTGRES_URL);

export const isProduction = () => process.env.NODE_ENV === "production";

/**
 * True when the tool is falling back to the on-disk dev store. Surfaced in the
 * UI so it's obvious nothing is really being published.
 */
export const isUsingDevFallback = () => !isProduction() && !databaseUrl();

