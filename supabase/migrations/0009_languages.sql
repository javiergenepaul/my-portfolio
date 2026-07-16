-- 0009_languages — spoken languages and proficiency
-- Matches LanguageInterface. `locale` ties a language to an app locale
-- (en/ja/fil/ceb); name/native_name are proper nouns, note is your prose.

drop table if exists public.languages cascade;

create table public.languages (
  id          uuid        primary key default gen_random_uuid(),
  name        text        not null default '',
  native_name text,
  locale      text, -- en | ja | fil | ceb
  level       text, -- Native | Fluent | Conversational | Basic
  note        jsonb       not null default '{}'::jsonb,
  flag_icon   text,
  published   boolean     not null default false,
  sort_order  integer     not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
select public.setup_content_table('languages');
