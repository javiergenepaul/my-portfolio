-- 0006_certificates — courses and credentials
-- Matches CertificateCardInterface.

drop table if exists public.certificates cascade;

create table public.certificates (
  id               uuid        primary key default gen_random_uuid(),
  title            jsonb       not null default '{}'::jsonb,
  organization     jsonb       not null default '{}'::jsonb,
  organization_img text,
  organization_alt jsonb       not null default '{}'::jsonb,
  issued_date      date,
  credential_id    text,
  credential_url   text,
  published        boolean     not null default false,
  sort_order       integer     not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
select public.setup_content_table('certificates');
