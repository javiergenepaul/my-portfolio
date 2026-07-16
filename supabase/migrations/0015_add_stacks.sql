-- 0015_add_stacks — associate tech stacks with experience, education, and
-- certificates (they only had it on services/projects before).
--
-- Stored as text[] of stack `name` keys, same shape as services/projects, so
-- the admin's stack picker works identically. Non-destructive.

alter table public.experience
  add column if not exists stack text[] not null default '{}';
alter table public.education
  add column if not exists stack text[] not null default '{}';
alter table public.certificates
  add column if not exists stack text[] not null default '{}';
