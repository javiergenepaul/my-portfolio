-- 0010_socials — GitHub, LinkedIn, Upwork, etc.
-- Matches SOCIAL_MEDIA_LINK_DATA: `key` identifies the link, `icon` picks the
-- glyph (they differ, e.g. key "linkedIn" vs icon "linkedin").

drop table if exists public.socials cascade;

create table public.socials (
  id         uuid        primary key default gen_random_uuid(),
  key        text        not null default '',
  icon       text,
  url        text,
  published  boolean     not null default false,
  sort_order integer     not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
select public.setup_content_table('socials');
