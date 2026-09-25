-- Schema for the image editor of the built-in categories.
-- Run once against your Postgres (Neon on the Vercel Marketplace has a free
-- tier that scales to zero): psql "$DATABASE_URL" -f lib/curated/schema.sql
--
-- The community category tables (community_categories, community_votes,
-- community_reports) belonged to a removed feature; an existing database can
-- drop them. community_images keeps its name because stored pictures and the
-- image store still use it.

-- Images that exist nowhere else: uploads from disk, pictures edited in the
-- browser, and links the browser couldn't read. Search picks and readable
-- links are stored as the link itself and never land here. Used only when R2
-- isn't configured; see lib/shared/storage.ts.
create table if not exists community_images (
  key          text        primary key,
  content_type text        not null,
  body         bytea       not null,
  created_at   timestamptz not null default now()
);

-- Picture replacements for the built-in categories (lib/curated/overrides.ts).
-- Kept here rather than in public/images so they survive every deploy.
create table if not exists curated_image_overrides (
  folder        text        not null,
  image         text        not null,
  image_url     text        not null,
  image_key     text,
  width         integer,
  height        integer,
  credit        jsonb,
  -- SHA-256 of the shipped file when it was replaced, to flag later changes.
  original_hash text,
  updated_at    timestamptz not null default now(),
  primary key (folder, image)
);

-- One row: the shared edit PIN for the built-in categories.
create table if not exists curated_settings (
  id                    smallint    primary key default 1 check (id = 1),
  edit_pin_hash         text,
  pin_attempts          integer     not null default 0,
  pin_window_started_at timestamptz
);

-- Added, edited and deleted examples of the built-in categories
-- (app/categories/examples.ts). Also created on first use by the app.
create table if not exists curated_example_edits (
  folder     text        not null,
  key        text        not null,
  edit       jsonb       not null,
  updated_at timestamptz not null default now(),
  primary key (folder, key)
);
