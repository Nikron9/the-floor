"use client";

import {
  ClientImageFailed,
  fetchAndShrink,
  probeLinkable,
} from "@/lib/community/clientImage";
import type { ImageResult } from "@/lib/community/search";
import type {
  CommunityCategorySummary,
  CommunityCategoryView,
  CommunityItem,
  ModerationRow,
} from "@/lib/community/types";

/** The message from the API if it sent one, so the UI never says "Error 400". */
const unwrap = async (response: Response) => {
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(body?.error ?? `Żądanie nie powiodło się (HTTP ${response.status})`);
  }
  return body;
};

const postJson = (path: string, payload: unknown) =>
  fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then(unwrap);

export type DraftItemInput = { name: string; alternatives?: string[] };

export const suggestItems = (
  name: string,
  count = 50
): Promise<{ items: Array<{ name: string; alternatives: string[] }> }> =>
  postJson("/api/community/suggest", { name, count });

export const createDraft = (
  name: string,
  items: DraftItemInput[]
): Promise<{ id: string; name: string; items: CommunityItem[] }> =>
  postJson("/api/community/categories", { name, items });

export const saveItems = (
  id: string,
  items: Array<Pick<CommunityItem, "id" | "name" | "alternatives">>
): Promise<{ category: CommunityCategoryView }> =>
  fetch(`/api/community/categories/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items }),
  }).then(unwrap);

export const publishCategory = (
  id: string
): Promise<{ category: CommunityCategoryView }> =>
  postJson(`/api/community/categories/${id}/publish`, {});

export const getCategory = (
  id: string
): Promise<{ category: CommunityCategoryView }> =>
  fetch(`/api/community/categories/${id}`).then(unwrap);

export const listCategories = (
  sort: "top" | "new" = "top",
  offset = 0
): Promise<{ categories: CommunityCategorySummary[]; hasMore: boolean }> =>
  fetch(
    `/api/community/categories?sort=${sort}&offset=${offset}`
  ).then(unwrap);

export const voteOnCategory = (
  id: string,
  direction: -1 | 0 | 1
): Promise<{ upvotes: number; downvotes: number; myVote: -1 | 0 | 1 }> =>
  postJson(`/api/community/categories/${id}/vote`, { direction });

export const reportCategory = (
  id: string,
  reason: string
): Promise<{ reported: boolean; hidden: boolean }> =>
  postJson(`/api/community/categories/${id}/report`, { reason });

export const deleteCategory = (id: string): Promise<{ deleted: boolean }> =>
  fetch(`/api/community/categories/${id}`, { method: "DELETE" }).then(unwrap);

/* ------------------------------------------------------------------ admin */

export const getAdminSession = (): Promise<{
  admin: boolean;
  configured: boolean;
}> => fetch("/api/community/admin/session").then(unwrap);

export const signInAsAdmin = (secret: string): Promise<{ admin: boolean }> =>
  postJson("/api/community/admin/session", { secret });

export const signOutAsAdmin = (): Promise<{ admin: boolean }> =>
  fetch("/api/community/admin/session", { method: "DELETE" }).then(unwrap);

export const listForModeration = (): Promise<{ categories: ModerationRow[] }> =>
  fetch("/api/community/admin/categories").then(unwrap);

/** Admin only. Hide a category from every listing, or put it back. */
export const setCategoryHidden = (
  id: string,
  hidden: boolean
): Promise<{ category: CommunityCategoryView }> =>
  postJson(`/api/community/categories/${id}/moderate`, { hidden });

const creditFields = (form: FormData, credit: ImageResult["credit"]) => {
  form.append("creditSource", credit.source);
  if (credit.sourceUrl) form.append("creditSourceUrl", credit.sourceUrl);
  if (credit.author) form.append("creditAuthor", credit.author);
  if (credit.license) form.append("creditLicense", credit.license);
};

/**
 * The URL to link for a search result.
 *
 * Commons originals are often 10-20 MB camera files; linking one would make
 * every screen showing the category download all of it. Commons serves scaled
 * copies on its standard thumbnail steps, so a wide original is linked at 1280
 * px (sharp on a 1080p projector) instead. Everything else links as-is.
 */
const COMMONS_LINK_WIDTH = 1280;

export const linkUrlFor = (result: ImageResult): string => {
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

/** Try to attach by link. Undefined means "can't link it, store a copy". */
const tryAttachLink = async (
  categoryId: string,
  itemId: string,
  url: string,
  addCredit: (form: FormData) => void,
  signal?: AbortSignal
): Promise<{ item: CommunityItem } | undefined> => {
  let size: { width: number; height: number };
  try {
    size = await probeLinkable(url, signal);
  } catch (error) {
    if (error instanceof ClientImageFailed) return undefined;
    throw error;
  }

  const form = new FormData();
  form.append("itemId", itemId);
  form.append("linkUrl", url);
  form.append("linkWidth", String(size.width));
  form.append("linkHeight", String(size.height));
  addCredit(form);

  return fetch(`/api/community/categories/${categoryId}/images`, {
    method: "POST",
    body: form,
    signal,
  }).then(unwrap);
};

/**
 * Attach a search result -- by link when the browser can read it, otherwise
 * as a stored copy.
 *
 * Linking is the default because it costs no storage at all: the picture is
 * served by Commons or Openverse, whose licences allow it. A copy is stored
 * only when the host won't send CORS headers or the file is huge.
 *
 * The copy path downloads in the browser where possible.
 *
 * Both sources send permissive CORS headers, so the bytes come straight from
 * the visitor to Commons or Openverse rather than through us. That matters:
 * pulling fifty images per category from a single Vercel IP got the server
 * rate-limited (HTTP 429) on almost every request. It also means we upload a
 * shrunken ~130 KB WebP instead of the server downloading the multi-megabyte
 * original.
 *
 * The server path stays as a fallback for anything the browser can't fetch,
 * and re-encodes whatever arrives either way.
 */
export const attachImageFromResult = async (
  categoryId: string,
  itemId: string,
  result: ImageResult,
  signal?: AbortSignal
): Promise<{ item: CommunityItem }> => {
  const linked = await tryAttachLink(
    categoryId,
    itemId,
    linkUrlFor(result),
    (form) => creditFields(form, result.credit),
    signal
  );
  if (linked) return linked;

  const form = new FormData();
  form.append("itemId", itemId);
  creditFields(form, result.credit);

  try {
    const shrunk = await fetchAndShrink(result.fullUrl, signal);
    form.append("file", shrunk, "image.webp");
  } catch {
    form.append("sourceUrl", result.fullUrl);
  }

  return fetch(`/api/community/categories/${categoryId}/images`, {
    method: "POST",
    body: form,
    signal,
  }).then(unwrap);
};

export const attachImageFromUrl = async (
  categoryId: string,
  itemId: string,
  sourceUrl: string
): Promise<{ item: CommunityItem }> => {
  const linked = await tryAttachLink(categoryId, itemId, sourceUrl, (form) => {
    form.append("creditSource", "Pasted link");
    form.append("creditSourceUrl", sourceUrl);
  });
  if (linked) return linked;

  // The host blocks cross-origin reads, so the server fetches and stores it.
  const form = new FormData();
  form.append("itemId", itemId);
  form.append("sourceUrl", sourceUrl);
  form.append("creditSource", "Pasted link");
  form.append("creditSourceUrl", sourceUrl);

  return fetch(`/api/community/categories/${categoryId}/images`, {
    method: "POST",
    body: form,
  }).then(unwrap);
};

export const attachImageFile = (
  categoryId: string,
  itemId: string,
  file: File | Blob,
  credit = "Uploaded"
): Promise<{ item: CommunityItem }> => {
  const form = new FormData();
  form.append("itemId", itemId);
  form.append("file", file, "image");
  form.append("creditSource", credit);

  return fetch(`/api/community/categories/${categoryId}/images`, {
    method: "POST",
    body: form,
  }).then(unwrap);
};

export const detachImage = (
  categoryId: string,
  itemId: string
): Promise<{ item: CommunityItem }> =>
  fetch(
    `/api/community/categories/${categoryId}/images?itemId=${encodeURIComponent(itemId)}`,
    { method: "DELETE" }
  ).then(unwrap);
