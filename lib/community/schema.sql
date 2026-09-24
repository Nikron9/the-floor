-- Schema for the community category pool.
-- Run once against your Postgres (Neon on the Vercel Marketplace has a free
-- tier that scales to zero): psql "$DATABASE_URL" -f lib/community/schema.sql

create table if not exists community_categories (
  id            text primary key,
  name          text        not null,
  slug          text        not null,
  status        text        not null default 'draft'
                  check (status in ('draft', 'published')),
  -- The whole example list. It's ~50 small objects that are always read and
  -- written together, so a side table would only buy joins.
  items         jsonb       not null default '[]'::jsonb,
  -- Anonymous owner token from an httpOnly cookie. Grants edit rights on the
  -- draft; never sent to the client.
  author_key    text        not null,
  upvotes       integer     not null default 0,
  downvotes     integer     not null default 0,
  report_count  integer     not null default 0,
  hidden_at     timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  published_at  timestamptz
);

-- The edit PIN (lib/community/pin.ts), added after the table first shipped --
-- hence `alter` rather than columns above, so re-running this upgrades an
-- existing database in place. Null on categories made before PINs existed:
-- those stay editable by their author and the admin only.
alter table community_categories
  add column if not exists edit_pin_hash text;
-- Wrong-PIN counter for a fixed window, so guessing is capped per category.
alter table community_categories
  add column if not exists pin_attempts integer not null default 0;
alter table community_categories
  add column if not exists pin_window_started_at timestamptz;

-- Listings read published, unhidden categories ordered by score or recency.
create index if not exists community_categories_browse
  on community_categories (status, hidden_at, published_at desc);
create index if not exists community_categories_score
  on community_categories (status, hidden_at, (upvotes - downvotes) desc);
create index if not exists community_categories_author
  on community_categories (author_key);

create table if not exists community_votes (
  category_id text        not null
                references community_categories(id) on delete cascade,
  voter_key   text        not null,
  -- 1 or -1. Counts on the category row are recomputed from this table rather
  -- than incremented, so concurrent votes can't lose each other.
  direction   smallint    not null check (direction in (-1, 1)),
  created_at  timestamptz not null default now(),
  primary key (category_id, voter_key)
);

create table if not exists community_reports (
  category_id text        not null
                references community_categories(id) on delete cascade,
  reporter_key text       not null,
  reason      text        not null default '',
  created_at  timestamptz not null default now(),
  primary key (category_id, reporter_key)
);

-- Images that exist nowhere else: uploads from disk, pictures edited in the
-- browser, and links the browser couldn't read. Search picks and readable
-- links are stored as the link itself and never land here. Used only when R2
-- isn't configured; see lib/community/storage.ts.
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
