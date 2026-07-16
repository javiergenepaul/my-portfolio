-- 0002_profile — name, headline, bio, contact, hero stats (singleton: one row)
--
-- Localized fields are per-locale maps: { "en": "...", "ja": "..." }.
-- full_name / job_title / email / phone are plain text (not translated in the
-- source). `stats` holds the hero counters, e.g.
--   { "projects": "10+", "technologies": "20+" }
-- Years-of-experience is derived from career_start_date, not stored.

drop table if exists public.profile cascade;

create table public.profile (
  id                uuid        primary key default gen_random_uuid(),
  full_name         text        not null default '',
  job_title         text        not null default '',
  bio               jsonb       not null default '{}'::jsonb,
  location          jsonb       not null default '{}'::jsonb,
  email             text,
  phone             text,
  career_start_date date,
  avatar            text,
  stats             jsonb       not null default '{}'::jsonb,
  published         boolean     not null default true,
  sort_order        integer     not null default 0,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
select public.setup_content_table('profile');
