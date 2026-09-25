import { readStoredImage } from "@/lib/shared/storage";

type Params = { params: Promise<{ key: string[] }> };

/**
 * Serves images kept in Postgres (see `postgresStore` in storage.ts).
 *
 * Keys are content-hashed, so a URL's bytes never change: the response is
 * cached for a year by the browser and by Vercel's CDN (`s-maxage`), which is
 * what keeps a projector pulling fifty pictures from costing fifty database
 * reads every game night.
 */
export async function GET(_request: Request, { params }: Params) {
  const { key: parts } = await params;
  const key = parts.map(decodeURIComponent).join("/");

  if (!/^categories\/[A-Za-z0-9]+\/[A-Za-z0-9]+-[a-f0-9]+\.webp$/.test(key)) {
    return new Response("Not found", { status: 404 });
  }

  const image = await readStoredImage(key).catch((error) => {
    console.error("[images] read failed", error);
    return undefined;
  });
  if (!image) {
    return new Response("Not found", {
      status: 404,
      headers: { "Cache-Control": "no-store" },
    });
  }

  return new Response(new Uint8Array(image.body), {
    headers: {
      "Content-Type": image.contentType,
      "Content-Length": String(image.body.byteLength),
      "Cache-Control": "public, max-age=31536000, s-maxage=31536000, immutable",
    },
  });
}
