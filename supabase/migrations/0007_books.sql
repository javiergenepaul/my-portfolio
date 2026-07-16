-- 0007_books — books that shaped how you think and build
-- Matches BookInterface. title/author are proper nouns; quote/reflection are
-- your words, so they're localized.

drop table if exists public.books cascade;

create table public.books (
  id         uuid        primary key default gen_random_uuid(),
  title      text        not null default '',
  author     text,
  quote      jsonb       not null default '{}'::jsonb,
  reflection jsonb       not null default '{}'::jsonb,
  theme      text,
  published  boolean     not null default false,
  sort_order integer     not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
select public.setup_content_table('books');
