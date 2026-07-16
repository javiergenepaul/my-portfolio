-- ─────────────────────────────────────────────────────────────────────────────
-- 0001_resume — the résumé builder's content
--
-- Deliberately NOT localized: a résumé is one document in one language, which
-- is why these are plain text columns while the portfolio tables use jsonb
-- per-locale maps. Mirrors src/screens/2024/resume/resume-content.ts.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── Summary + contact line (singleton: exactly one row) ─────────────────────
create table if not exists public.resume_overview (
  id         uuid        primary key default gen_random_uuid(),
  summary    text        not null default '',
  phone      text,
  email      text,
  location   text,
  -- [{ "platform": "github", "url": "https://..." }, ...]
  links      jsonb       not null default '[]'::jsonb,
  published  boolean     not null default true,
  sort_order integer     not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
select public.setup_content_table('resume_overview');

-- ── Work history ────────────────────────────────────────────────────────────
create table if not exists public.resume_experience (
  id              uuid        primary key default gen_random_uuid(),
  role            text        not null default '',
  company         text        not null default '',
  employment_type text,
  location        text,
  period          text,
  promotion       text,
  bullets         text[]      not null default '{}',
  published       boolean     not null default false,
  sort_order      integer     not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
select public.setup_content_table('resume_experience');

-- ── Education ───────────────────────────────────────────────────────────────
create table if not exists public.resume_education (
  id         uuid        primary key default gen_random_uuid(),
  degree     text        not null default '',
  school     text        not null default '',
  period     text,
  published  boolean     not null default false,
  sort_order integer     not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
select public.setup_content_table('resume_education');

-- ── Projects ────────────────────────────────────────────────────────────────
create table if not exists public.resume_projects (
  id         uuid        primary key default gen_random_uuid(),
  name       text        not null default '',
  context    text,
  url        text,
  bullets    text[]      not null default '{}',
  stack      text[]      not null default '{}',
  published  boolean     not null default false,
  sort_order integer     not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
select public.setup_content_table('resume_projects');

-- ── Certification groups (issuer + year + titles) ───────────────────────────
create table if not exists public.resume_certifications (
  id         uuid        primary key default gen_random_uuid(),
  issuer     text        not null default '',
  year       text,
  titles     text[]      not null default '{}',
  published  boolean     not null default false,
  sort_order integer     not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
select public.setup_content_table('resume_certifications');

-- ── Skill groups (label + items) ────────────────────────────────────────────
create table if not exists public.resume_skills (
  id         uuid        primary key default gen_random_uuid(),
  label      text        not null default '',
  items      text[]      not null default '{}',
  published  boolean     not null default false,
  sort_order integer     not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
select public.setup_content_table('resume_skills');
