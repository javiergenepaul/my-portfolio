-- 0011_testimonials — recommendations from colleagues and clients
--
-- Matches TestimonialInterface. `links` replaces the fixed github/linkedin/
-- behance columns with the same { platform, url }[] shape the submission form
-- collects, so approved submissions from /testimonial/<token> map straight in.

drop table if exists public.testimonials cascade;

create table public.testimonials (
  id           uuid        primary key default gen_random_uuid(),
  name         text        not null default '',
  role         jsonb       not null default '{}'::jsonb,
  company      text,
  text         jsonb       not null default '{}'::jsonb,
  rating       numeric(2,1), -- half-stars are real data (4.5), so not integer

  avatar       text,
  service      text,
  relationship text, -- Colleague | Client | Manager | Mentor | Peer
  links        jsonb       not null default '[]'::jsonb,
  published    boolean     not null default false,
  sort_order   integer     not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
select public.setup_content_table('testimonials');
