"use client";

import {
  ClientImageFailed,
  fetchAndShrink,
  probeLinkable,
} from "@/lib/shared/clientImage";
import type { ImageResult } from "@/lib/shared/search";
import type { ImageCredit } from "@/lib/shared/types";

/** Client calls for replacing pictures in the built-in categories. */

/**
 * Wikimedia thumbnails can be requested at any width; asking for a sensible
 * one instead of the multi-megabyte original keeps linked images light.
 */
const COMMONS_LINK_WIDTH = 1280;

const linkUrlFor = (result: ImageResult): string => {
  const thumb = result.thumbUrl;
  if (
    result.width > COMMONS_LINK_WIDTH &&
    thumb.startsWith("https://upload.wikimedia.org/") &&
    thumb.includes("/thumb/") &&
    /\/\d+px-[^/]+$/.test(thumb)
  ) {
    return thumb.replace(/\/\d+px-([^/]+)$/, `/${COMMONS_LINK_WIDTH}px-$1`);
  }
  return result.fullUrl;
};

export type CuratedAccess = {
  isAdmin: boolean;
  isPinEditor: boolean;
  canEdit: boolean;
  hasPin: boolean;
};

export type AdminOverrideRow = {
  folder: string;
  image: string;
  imageUrl: string;
  credit: ImageCredit | null;
  updatedAt: string;
  categoryName: string | null;
  name: string | null;
  orphaned: boolean;
  repoChanged: boolean;
};

const unwrap = async (response: Response) => {
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(body?.error ?? `Żądanie nie powiodło się (HTTP ${response.status})`);
  }
  return body;
};

const sendJson = (method: string, path: string, payload: unknown) =>
  fetch(path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then(unwrap);

export const getCuratedAccess = (): Promise<CuratedAccess> =>
  fetch("/api/curated/access", { cache: "no-store" }).then(unwrap);

export const getCuratedOverrides = (): Promise<{
  overrides: Record<string, Record<string, string>>;
}> => fetch("/api/curated/overrides", { cache: "no-store" }).then(unwrap);

export const unlockCurated = (pin: string) => sendJson("POST", "/api/curated/pin", { pin });

export const lockCurated = () =>
  fetch("/api/curated/pin", { method: "DELETE" }).then(unwrap);

export const setCuratedPin = (pin: string) => sendJson("PUT", "/api/curated/pin", { pin });

export const listCuratedOverridesForAdmin = (): Promise<{
  overrides: AdminOverrideRow[];
}> => fetch("/api/curated/admin", { cache: "no-store" }).then(unwrap);

export const revertCuratedImage = (folder: string, image: string) =>
  fetch(
    `/api/curated/images?folder=${encodeURIComponent(folder)}&image=${encodeURIComponent(image)}`,
    { method: "DELETE" }
  ).then(unwrap);

type Saved = { override: { imageUrl: string } };

const post = (form: FormData): Promise<Saved> =>
  fetch("/api/curated/images", { method: "POST", body: form }).then(unwrap);

const baseForm = (folder: string, image: string) => {
  const form = new FormData();
  form.append("folder", folder);
  form.append("image", image);
  return form;
};

const addCredit = (form: FormData, credit: ImageCredit) => {
  form.append("creditSource", credit.source);
  if (credit.sourceUrl) form.append("creditSourceUrl", credit.sourceUrl);
  if (credit.author) form.append("creditAuthor", credit.author);
  if (credit.license) form.append("creditLicense", credit.license);
};

/** Link when the browser can read the picture; undefined means "store a copy". */
const tryLink = async (
  folder: string,
  image: string,
  url: string,
  credit: ImageCredit
): Promise<Saved | undefined> => {
  let size: { width: number; height: number };
  try {
    size = await probeLinkable(url);
  } catch (error) {
    if (error instanceof ClientImageFailed) return undefined;
    throw error;
  }
  const form = baseForm(folder, image);
  form.append("linkUrl", url);
  form.append("linkWidth", String(size.width));
  form.append("linkHeight", String(size.height));
  addCredit(form, credit);
  return post(form);
};

export const replaceFromResult = async (
  folder: string,
  image: string,
  result: ImageResult
): Promise<Saved> => {
  const linked = await tryLink(folder, image, linkUrlFor(result), result.credit);
  if (linked) return linked;

  const form = baseForm(folder, image);
  addCredit(form, result.credit);
  try {
    form.append("file", await fetchAndShrink(result.fullUrl), "image.webp");
  } catch {
    form.append("sourceUrl", result.fullUrl);
  }
  return post(form);
};

export const replaceFromUrl = async (
  folder: string,
  image: string,
  url: string
): Promise<Saved> => {
  const credit: ImageCredit = {
    source: "Pasted link",
    sourceUrl: url,
    author: null,
    license: null,
  };
  const linked = await tryLink(folder, image, url, credit);
  if (linked) return linked;

  const form = baseForm(folder, image);
  form.append("sourceUrl", url);
  addCredit(form, credit);
  return post(form);
};

export const replaceWithFile = (
  folder: string,
  image: string,
  file: File | Blob,
  source = "Uploaded"
): Promise<Saved> => {
  const form = baseForm(folder, image);
  form.append("file", file, "image");
  form.append("creditSource", source);
  return post(form);
};
