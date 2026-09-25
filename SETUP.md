# Setting up the picture editor

The game itself needs no services: every page is static and the game state
lives in the browser. The only server-side feature is the **picture editor for
the built-in categories** (`/categories` → a category → *Podmień obrazki*),
which lets the admin, or anyone with the shared PIN, replace a picture without a
deploy. Replacements are layered over `public/images/` at runtime, so deploys
never overwrite them.

## Trying it with no accounts and no keys

`npm run dev` works as is. Without a database the editor writes to disk under
`.community-dev/` and `public/community-dev/` (folder names kept from the
removed community feature). That fallback refuses to start in production.

## Going live

### 1. Postgres (required)

Any Postgres works; Neon through the Vercel Marketplace has a free tier that
scales to zero.

```bash
psql "$DATABASE_URL" -f lib/curated/schema.sql
```

No psql? Paste `lib/curated/schema.sql` into the Neon console's SQL Editor.
Re-running it is safe — every statement is `if not exists`.

```
DATABASE_URL=postgres://...
```

A database from before the community feature was removed still has
`community_categories`, `community_votes` and `community_reports`; they are no
longer used and can be dropped. `community_images` is still used.

### Where pictures live

Most replacements are **not copied at all**: a search pick or a pasted link the
browser can read (CORS, decodes, long edge ≥ 600 px) is saved as the link
itself. Only pictures that exist nowhere else — uploads, pictures edited in the
browser (crop / erase), links whose host blocks cross-origin reads — are
stored, in the `community_images` table, and served from `/api/images/…` with an
immutable cache header. Older rows point at `/api/community/images/…`; a rewrite
in `next.config.ts` keeps those working.

### 2. Cloudflare R2 (optional)

If configured, stored pictures go to R2 instead of Postgres (free egress, 10 GB
free). Give the bucket a public URL and a CORS policy allowing `GET` from the
site, so the in-browser editor can read pixels back.

```
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET=...
R2_PUBLIC_BASE_URL=https://images.example.com
```

### 3. Web image search — Serper (optional)

Commons and Openverse are searched straight from the browser, free and keyless,
but contain almost no trademarked artwork (logos, mascots, game characters).
With a Serper key "Web images" appears as an extra source.

```
SERPER_API_KEY=...
```

### 4. Admin and PIN

```
COMMUNITY_ADMIN_SECRET=...   # long and random, e.g. openssl rand -base64 32
```

Sign in at `/admin` to set the shared editing PIN (4–8 digits) and to see and
revert every replaced picture. Only a salted scrypt hash of the PIN is stored
(`lib/shared/pin.ts`); five wrong guesses per 15 minutes, counted before
checking so parallel guesses share the budget. The admin cookie holds an HMAC
derived from the secret, never the secret itself, so rotating it signs everyone
out. (The variable keeps its old name so existing deployments keep working.)

### 5. Cleanup job

`/api/cleanup` runs daily (`vercel.json`) and deletes stored pictures nothing
references any more — failed deletes during replacement, and everything left
over from the removed community categories. Guards: objects younger than 24 h
are never swept, a failure reading references aborts the run, and at most 500
objects go per run.

```
CRON_SECRET=...
```

In production the route refuses to run without it. By hand:

```bash
curl -H "Authorization: Bearer $CRON_SECRET" https://…/api/cleanup
```

## Checking it still works

```bash
npm test
```

`scripts/bench-image-size.mjs` re-measures the stored-image size numbers
against live Commons pictures.
