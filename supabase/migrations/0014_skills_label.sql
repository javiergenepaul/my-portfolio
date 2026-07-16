-- 0014_skills_label — per-locale display name for stacks/skills.
--
-- `name` stays the stable key (springBoot) — referenced by services/projects
-- and the i18n keys. `label` adds the localized display name so it's editable
-- per language in the admin. Non-destructive: existing rows keep their data;
-- run `pnpm seed:stack-labels` afterward to backfill labels from the i18n files.

alter table public.skills
  add column if not exists label jsonb not null default '{}'::jsonb;
