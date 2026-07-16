-- 0005_projects — portfolio projects and case studies
--
-- Matches ProjectInterface in src/config/types.ts:
--   category         text[]  — a project has several categories
--   stack            text[]  — stack keys (e.g. "react", "springBoot")
--   carousel         jsonb   — [{ value, image, name }] screenshots
--   key_contribution jsonb   — [{ name: {en:..}, description: {en:..} }]
--   hidden           bool    — kept out of listings (confidential work)
--
-- Safe to re-run while empty: dropped and rebuilt.

drop table if exists public.projects cascade;

create table public.projects (
  id               uuid        primary key default gen_random_uuid(),
  title            jsonb       not null default '{}'::jsonb,
  description      jsonb       not null default '{}'::jsonb,
  project_id       text,
  company          text,
  date             date,
  category         text[]      not null default '{}',
  type             text, -- personal | client | confidential | tutorial
  status           text, -- completed | ongoing | unfinished
  preview_url      text,
  code_url         text,
  stack            text[]      not null default '{}',
  carousel         jsonb       not null default '[]'::jsonb,
  key_contribution jsonb       not null default '[]'::jsonb,
  hidden           boolean     not null default false,
  published        boolean     not null default false,
  sort_order       integer     not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
select public.setup_content_table('projects');
