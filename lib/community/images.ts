import { createHash } from "node:crypto";
import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

import sharp, { type Metadata, type Sharp } from "sharp";

import { LIMITS } from "./config";

export type NormalizedImage = {
  buffer: Buffer;
  width: number;
  height: number;
  bytes: number;
  /** Content hash, so the storage key changes whenever the bytes do. */
  hash: string;
};

export class ImageRejected extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ImageRejected";
  }
}

/**
 * Re-encode whatever the user picked into something the projector can show and
 * the free tier can afford to store.
 *
 * The size floor is checked against the *source*: upscaling a 200px thumbnail
 * to 1600px passes a naive dimension check while still looking like mush on a
 * TV, which is exactly the failure the original desktop tool existed to avoid.
 */
export async function normalizeImage(input: Buffer): Promise<NormalizedImage> {
  if (input.byteLength > LIMITS.maxSourceImageBytes) {
    throw new ImageRejected(
      `That file is ${Math.round(input.byteLength / 1024 / 1024)} MB, over the ${
        LIMITS.maxSourceImageBytes / 1024 / 1024
      } MB limit.`
    );
  }

  let pipeline: Sharp;
  let metadata: Metadata;
  try {
    pipeline = sharp(input, { failOn: "error" });
    metadata = await pipeline.metadata();
  } catch {
    throw new ImageRejected("To nie wygląda na obrazek, który da się odczytać.");
  }

  const { width, height } = metadata;
  if (!width || !height) {
    throw new ImageRejected("Nie da się odczytać wymiarów tego obrazka.");
  }

  if (Math.max(width, height) < LIMITS.minSourceImageEdge) {
    throw new ImageRejected(
      `Ten obrazek ma tylko ${width}x${height}. Dłuższy bok musi mieć co najmniej ` +
        `${LIMITS.minSourceImageEdge}px, żeby był ostry na dużym ekranie.`
    );
  }

  const buffer = await pipeline
    .rotate() // honour EXIF orientation before we strip it
    .resize({
      width: LIMITS.storedImageMaxEdge,
      height: LIMITS.storedImageMaxEdge,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: LIMITS.storedImageQuality })
    .toBuffer();

  const resized = await sharp(buffer).metadata();

  return {
    buffer,
    width: resized.width ?? width,
    height: resized.height ?? height,
    bytes: buffer.byteLength,
    hash: createHash("sha256").update(buffer).digest("hex").slice(0, 16),
  };
}

const PRIVATE_V4 =
  /^(0\.|10\.|127\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.|100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\.)/;

const isPrivateAddress = (address: string): boolean => {
  const family = isIP(address);
  if (family === 4) return PRIVATE_V4.test(address);
  if (family === 6) {
    const normalized = address.toLowerCase();
    return (
      normalized === "::1" ||
      normalized === "::" ||
      normalized.startsWith("fc") ||
      normalized.startsWith("fd") ||
      normalized.startsWith("fe80") ||
      // IPv4-mapped, e.g. ::ffff:127.0.0.1
      (normalized.startsWith("::ffff:") &&
        PRIVATE_V4.test(normalized.slice(7)))
    );
  }
  return true;
};

/**
 * Download an image the user pointed us at.
 *
 * This endpoint takes a URL from the internet and fetches it from inside our
 * own network, which is the textbook setup for SSRF -- so it refuses anything
 * that isn't plain http(s) resolving to a public address, and it caps the read
 * rather than trusting Content-Length.
 */
export async function fetchSourceImage(rawUrl: string): Promise<Buffer> {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    throw new ImageRejected("To nie jest prawidłowy adres URL.");
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new ImageRejected("Dozwolone są tylko adresy http i https.");
  }

  const host = url.hostname.replace(/^\[|\]$/g, "");
  if (isIP(host)) {
    if (isPrivateAddress(host)) {
      throw new ImageRejected("Ten adres jest nieosiągalny.");
    }
  } else {
    const resolved = await lookup(host, { all: true }).catch(() => []);
    if (resolved.length === 0) {
      throw new ImageRejected("Nie udało się rozwiązać nazwy hosta.");
    }
    if (resolved.some((entry) => isPrivateAddress(entry.address))) {
      throw new ImageRejected("Ten adres jest nieosiągalny.");
    }
  }

  // Every request from here shares one datacenter IP, so an image host sees
  // the whole site's traffic as a single client and throttles accordingly.
  // Most images are fetched by the visitor's browser for exactly that reason;
  // this path is the fallback, so it backs off rather than giving up.
  let response: Response | undefined;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    response = await fetch(url, {
      redirect: "error",
      signal: AbortSignal.timeout(15_000),
      headers: {
        // Some hosts 403 an empty UA. Identify honestly rather than spoofing;
        // Wikimedia's policy asks for a contactable agent string.
        "User-Agent":
          "the-floor-game-community-tool/1.0 (+https://the-floor-game.vercel.app)",
        Accept: "image/*",
      },
    }).catch(() => undefined);

    if (response?.status !== 429) break;

    const retryAfter = Number(response.headers.get("retry-after"));
    const waitMs = Number.isFinite(retryAfter) && retryAfter > 0
      ? Math.min(retryAfter * 1000, 5_000)
      : 500 * 2 ** attempt;

    if (attempt < 2) {
      await new Promise((resolve) => setTimeout(resolve, waitMs));
    }
  }

  if (!response?.ok) {
    if (response?.status === 429) {
      throw new ImageRejected(
        "Serwer z obrazkami ogranicza liczbę żądań. Użyj przycisku Szukaj i wybierz obrazek bezpośrednio."
      );
    }
    throw new ImageRejected(
      `Nie udało się pobrać obrazka${response ? ` (HTTP ${response.status})` : ""}.`
    );
  }

  const type = response.headers.get("content-type") ?? "";
  if (type && !type.startsWith("image/")) {
    throw new ImageRejected(`Ten adres zwrócił ${type}, a nie obrazek.`);
  }

  const body = response.body;
  if (!body) throw new ImageRejected("Ten adres zwrócił pustą odpowiedź.");

  const chunks: Uint8Array[] = [];
  let total = 0;
  for await (const chunk of body as unknown as AsyncIterable<Uint8Array>) {
    total += chunk.byteLength;
    if (total > LIMITS.maxSourceImageBytes) {
      throw new ImageRejected("Ten obrazek jest za duży, żeby go pobrać.");
    }
    chunks.push(chunk);
  }

  return Buffer.concat(chunks);
}
