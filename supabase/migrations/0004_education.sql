-- 0004_education — degrees and schooling
-- Same ContentBodyInterface shape as experience, minus the work-only bits.

drop table if exists public.education cascade;

create table public.education (
  id              uuid        primary key default gen_random_uuid(),
  title           jsonb       not null default '{}'::jsonb,
  subtitle        jsonb       not null default '{}'::jsonb,
  description     jsonb       not null default '{}'::jsonb,
  level           text, -- tertiary | vocational | secondary | primary
  start_date      date,
  end_date        text, -- ISO date or "present"
  abbreviation    text,
  subtitle_url    text,
  watermark       text,
  watermark_alt   jsonb       not null default '{}'::jsonb,
  watermark_width integer,
  published       boolean     not null default false,
  sort_order      integer     not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
select public.setup_content_table('education');
