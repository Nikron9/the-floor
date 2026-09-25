import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { neon } from "@neondatabase/serverless";

import { NotConfigured, databaseUrl, isProduction } from "../shared/config";
import type { ImageCredit } from "../shared/types";
import type { ExampleEdit } from "../../app/categories/examples";

/**
 * Picture replacements for the built-in (curated) categories.
 *
 * Curated categories ship as files in `public/images/<folder>/`, so any change
 * made there is only as durable as the next deploy. Replacements made in the
 * app live here instead, keyed by the folder and the original file name, and
 * are layered over the shipped files when a category is resolved. A deploy
 * never touches this table, so an edit survives every deploy.
 *
 * `originalHash` is the SHA-256 of the shipped file at the time of the edit.
 * If a later deploy changes that file, the edit still wins, but the admin page
 * flags it so someone can decide whether to go back to the repo version.
 */

export type CuratedOverride = {
  folder: string;
  image: string;
  imageUrl: string;
  /** Set when the picture is a stored copy; null when it is a link. */
  imageKey: string | null;
  width: number | null;
  height: number | null;
  credit: ImageCredit | null;
  originalHash: string | null;
  updatedAt: string;
};

export type PinState = {
  editPinHash: string | null;
  attempts: number;
  windowStartedAt: string | null;
};

/** An added, edited or deleted example; see app/categories/examples.ts. */
export type CuratedExampleEdit = {
  folder: string;
  key: string;
  edit: ExampleEdit;
  updatedAt: string;
};

export type CuratedRepo = {
  listEdits(): Promise<CuratedExampleEdit[]>;
  getEdit(folder: string, key: string): Promise<CuratedExampleEdit | undefined>;
  upsertEdit(folder: string, key: string, edit: ExampleEdit): Promise<CuratedExampleEdit>;
  removeEdit(folder: string, key: string): Promise<void>;
  list(): Promise<CuratedOverride[]>;
  get(folder: string, image: string): Promise<CuratedOverride | undefined>;
  upsert(override: Omit<CuratedOverride, "updatedAt">): Promise<CuratedOverride>;
  remove(folder: string, image: string): Promise<void>;
  allImageKeys(): Promise<Set<string>>;
  pinHash(): Promise<string | null>;
  setPinHash(hash: string): Promise<void>;
  /** Count one attempt before checking it; see lib/shared/pin.ts. */
  claimPinAttempt(windowStartedBefore: string): Promise<PinState>;
  clearPinAttempts(): Promise<void>;
};

export const sha256 = (data: Uint8Array): string =>
  createHash("sha256").update(data).digest("hex");

/* -------------------------------------------------------------------------- */
/* Postgres                                                                    */
/* -------------------------------------------------------------------------- */

type Row = Record<string, unknown>;

const fromRow = (row: Row): CuratedOverride => ({
  folder: String(row.folder),
  image: String(row.image),
  imageUrl: String(row.image_url),
  imageKey: row.image_key ? String(row.image_key) : null,
  width: row.width == null ? null : Number(row.width),
  height: row.height == null ? null : Number(row.height),
  credit: (row.credit as ImageCredit | null) ?? null,
  originalHash: row.original_hash ? String(row.original_hash) : null,
  updatedAt: new Date(row.updated_at as string).toISOString(),
});

const editFromRow = (row: Row): CuratedExampleEdit => ({
  folder: String(row.folder),
  key: String(row.key),
  edit: row.edit as ExampleEdit,
  updatedAt: new Date(row.updated_at as string).toISOString(),
});

const postgresRepo = (connectionString: string): CuratedRepo => {
  const sql = neon(connectionString);

  // Added after the first deploys, so the table is created on first use
  // instead of relying on schema.sql having been re-run.
  let editsTable: Promise<unknown> | undefined;
  const ensureEditsTable = () =>
    (editsTable ??= sql`
      create table if not exists curated_example_edits (
        folder     text        not null,
        key        text        not null,
        edit       jsonb       not null,
        updated_at timestamptz not null default now(),
        primary key (folder, key)
      )
    `.catch((error) => {
      editsTable = undefined;
      throw error;
    }));

  const pinRow = async (): Promise<Row | undefined> => {
    // The settings table holds exactly one row; create it on first use so a
    // fresh database needs nothing but the schema.
    await sql`insert into curated_settings (id) values (1) on conflict do nothing`;
    const rows = await sql`select * from curated_settings where id = 1`;
    return rows[0];
  };

  return {
    async listEdits() {
      await ensureEditsTable();
      const rows = await sql`select * from curated_example_edits order by folder, key`;
      return rows.map(editFromRow);
    },

    async getEdit(folder, key) {
      await ensureEditsTable();
      const rows = await sql`
        select * from curated_example_edits where folder = ${folder} and key = ${key}
      `;
      return rows[0] ? editFromRow(rows[0]) : undefined;
    },

    async upsertEdit(folder, key, edit) {
      await ensureEditsTable();
      const rows = await sql`
        insert into curated_example_edits (folder, key, edit, updated_at)
        values (${folder}, ${key}, ${JSON.stringify(edit)}::jsonb, now())
        on conflict (folder, key) do update
           set edit = excluded.edit, updated_at = now()
        returning *
      `;
      return editFromRow(rows[0]);
    },

    async removeEdit(folder, key) {
      await ensureEditsTable();
      await sql`delete from curated_example_edits where folder = ${folder} and key = ${key}`;
    },

    async list() {
      const rows = await sql`select * from curated_image_overrides order by folder, image`;
      return rows.map(fromRow);
    },

    async get(folder, image) {
      const rows = await sql`
        select * from curated_image_overrides where folder = ${folder} and image = ${image}
      `;
      return rows[0] ? fromRow(rows[0]) : undefined;
    },

    async upsert(o) {
      const rows = await sql`
        insert into curated_image_overrides
               (folder, image, image_url, image_key, width, height, credit, original_hash, updated_at)
        values (${o.folder}, ${o.image}, ${o.imageUrl}, ${o.imageKey}, ${o.width}, ${o.height},
                ${o.credit ? JSON.stringify(o.credit) : null}::jsonb, ${o.originalHash}, now())
        on conflict (folder, image) do update
           set image_url = excluded.image_url,
               image_key = excluded.image_key,
               width = excluded.width,
               height = excluded.height,
               credit = excluded.credit,
               original_hash = excluded.original_hash,
               updated_at = now()
        returning *
      `;
      return fromRow(rows[0]);
    },

    async remove(folder, image) {
      await sql`
        delete from curated_image_overrides where folder = ${folder} and image = ${image}
      `;
    },

    async allImageKeys() {
      const rows = await sql`
        select image_key from curated_image_overrides where image_key is not null
      `;
      return new Set(rows.map((row) => String(row.image_key)));
    },

    async pinHash() {
      const row = await pinRow();
      return row?.edit_pin_hash ? String(row.edit_pin_hash) : null;
    },

    async setPinHash(hash) {
      await pinRow();
      await sql`
        update curated_settings
           set edit_pin_hash = ${hash}, pin_attempts = 0, pin_window_started_at = null
         where id = 1
      `;
    },

    async claimPinAttempt(windowStartedBefore) {
      await pinRow();
      const rows = await sql`
        update curated_settings
           set pin_attempts = case
                 when pin_window_started_at is null
                   or pin_window_started_at < ${windowStartedBefore}
                 then 1 else pin_attempts + 1 end,
               pin_window_started_at = case
                 when pin_window_started_at is null
                   or pin_window_started_at < ${windowStartedBefore}
                 then now() else pin_window_started_at end
         where id = 1
        returning pin_attempts, pin_window_started_at, edit_pin_hash
      `;
      const row = rows[0];
      return {
        attempts: Number(row.pin_attempts),
        windowStartedAt: new Date(row.pin_window_started_at as string).toISOString(),
        editPinHash: row.edit_pin_hash ? String(row.edit_pin_hash) : null,
      };
    },

    async clearPinAttempts() {
      await sql`
        update curated_settings set pin_attempts = 0, pin_window_started_at = null where id = 1
      `;
    },
  };
};

/* -------------------------------------------------------------------------- */
/* Local JSON file, for `npm run dev` without a database                       */
/* -------------------------------------------------------------------------- */

type DevFile = { overrides: CuratedOverride[]; edits?: CuratedExampleEdit[]; pin: PinState };

const devRepo = (): CuratedRepo => {
  const file = path.join(process.cwd(), ".community-dev", "curated.json");
  let queue: Promise<unknown> = Promise.resolve();

  const read = async (): Promise<DevFile> => {
    try {
      return JSON.parse(await readFile(file, "utf8")) as DevFile;
    } catch {
      return { overrides: [], pin: { editPinHash: null, attempts: 0, windowStartedAt: null } };
    }
  };

  const mutate = <T>(fn: (data: DevFile) => T): Promise<T> => {
    const next = queue.then(async () => {
      const data = await read();
      const result = fn(data);
      await mkdir(path.dirname(file), { recursive: true });
      await writeFile(file, JSON.stringify(data, null, 2));
      return result;
    });
    queue = next.catch(() => undefined);
    return next;
  };

  const same = (o: CuratedOverride, folder: string, image: string) =>
    o.folder === folder && o.image === image;

  const sameEdit = (e: CuratedExampleEdit, folder: string, key: string) =>
    e.folder === folder && e.key === key;

  return {
    listEdits: async () => (await read()).edits ?? [],
    getEdit: async (folder, key) =>
      ((await read()).edits ?? []).find((e) => sameEdit(e, folder, key)),
    upsertEdit: (folder, key, edit) =>
      mutate((data) => {
        const saved = { folder, key, edit, updatedAt: new Date().toISOString() };
        data.edits = [...(data.edits ?? []).filter((e) => !sameEdit(e, folder, key)), saved];
        return saved;
      }),
    removeEdit: (folder, key) =>
      mutate((data) => {
        data.edits = (data.edits ?? []).filter((e) => !sameEdit(e, folder, key));
      }),
    list: async () => (await read()).overrides,
    get: async (folder, image) =>
      (await read()).overrides.find((o) => same(o, folder, image)),
    upsert: (input) =>
      mutate((data) => {
        const saved = { ...input, updatedAt: new Date().toISOString() };
        data.overrides = [
          ...data.overrides.filter((o) => !same(o, input.folder, input.image)),
          saved,
        ];
        return saved;
      }),
    remove: (folder, image) =>
      mutate((data) => {
        data.overrides = data.overrides.filter((o) => !same(o, folder, image));
      }),
    allImageKeys: async () =>
      new Set(
        (await read()).overrides
          .map((o) => o.imageKey)
          .filter((key): key is string => Boolean(key))
      ),
    pinHash: async () => (await read()).pin.editPinHash,
    setPinHash: (hash) =>
      mutate((data) => {
        data.pin = { editPinHash: hash, attempts: 0, windowStartedAt: null };
      }),
    claimPinAttempt: (windowStartedBefore) =>
      mutate((data) => {
        const fresh =
          !data.pin.windowStartedAt || data.pin.windowStartedAt < windowStartedBefore;
        data.pin = {
          ...data.pin,
          attempts: fresh ? 1 : data.pin.attempts + 1,
          windowStartedAt: fresh ? new Date().toISOString() : data.pin.windowStartedAt,
        };
        return data.pin;
      }),
    clearPinAttempts: () =>
      mutate((data) => {
        data.pin = { ...data.pin, attempts: 0, windowStartedAt: null };
      }),
  };
};

let cached: CuratedRepo | undefined;

export const curatedRepo = (): CuratedRepo => {
  if (cached) return cached;

  const url = databaseUrl();
  if (url) return (cached = postgresRepo(url));

  if (isProduction()) {
    throw new NotConfigured(
      "Edycja obrazków nie jest skonfigurowana w tym wdrożeniu. " +
        "Wymagany jest DATABASE_URL z zastosowanym lib/curated/schema.sql."
    );
  }
  return (cached = devRepo());
};
