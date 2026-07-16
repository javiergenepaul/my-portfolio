-- 0003_experience — work history and roles
--
-- Shapes match ContentBodyInterface in src/config/types.ts so nothing is lost:
--   end_date  text  — an ISO date OR the literal "present"
--   promotion jsonb — PromotionInterface[]; each entry's title/subtitle/
--                     description are themselves per-locale maps, e.g.
--                     [{ "title": {"en":"..."}, "startYear":"2024-01-01", ... }]
--
-- Safe to re-run while empty: the table is dropped and rebuilt.

drop table if exists public.experience cascade;

create table public.experience (
  id              uuid        primary key default gen_random_uuid(),
  title           jsonb       not null default '{}'::jsonb,
  subtitle        jsonb       not null default '{}'::jsonb,
  description     jsonb       not null default '{}'::jsonb,
  employment_type text,
  start_date      date,
  end_date        text,
  is_work         boolean     not null default true,
  abbreviation    text,
  subtitle_url    text,
  watermark       text,
  watermark_alt   jsonb       not null default '{}'::jsonb,
  watermark_width integer,
  promotion       jsonb       not null default '[]'::jsonb,
  published       boolean     not null default false,
  sort_order      integer     not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
select public.setup_content_table('experience');
