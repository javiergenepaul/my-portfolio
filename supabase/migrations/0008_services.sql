-- 0008_services — what you offer
-- Matches ServiceOfferInterface: sub_details is a localized bullet list,
-- stack holds stack keys shown as chips.

drop table if exists public.services cascade;

create table public.services (
  id          uuid        primary key default gen_random_uuid(),
  title       jsonb       not null default '{}'::jsonb,
  description jsonb       not null default '{}'::jsonb,
  -- per-locale bullet lists: { "en": ["...", "..."], "ja": [...] }
  sub_details jsonb       not null default '{}'::jsonb,
  stack       text[]      not null default '{}',
  published   boolean     not null default false,
  sort_order  integer     not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
select public.setup_content_table('services');
