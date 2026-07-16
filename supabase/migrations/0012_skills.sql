-- 0012_skills — tech stack and proficiency
--
-- Matches TechStackInterface, flattened: the source groups stacks under
-- SKILL_CATEGORIES, so `category` carries the group key each row belongs to.
-- Nothing localized — these are product names.
--   date_ended  text — an ISO date OR the literal "present"
--   rate        int  — 1..10 (the UI renders it as dots/rings)

drop table if exists public.skills cascade;

create table public.skills (
  id           uuid        primary key default gen_random_uuid(),
  name         text        not null default '',
  category     text, -- backend | frontend | others (SKILL_CATEGORIES key)
  rate         integer,
  url          text,
  icon         text,
  alt          text,
  is_favorite  boolean     not null default false,
  is_studying  boolean     not null default false,
  date_started date,
  date_ended   text,
  published    boolean     not null default false,
  sort_order   integer     not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
select public.setup_content_table('skills');
