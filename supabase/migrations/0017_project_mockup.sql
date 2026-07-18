-- 0017_project_mockup — a project's screenshot plus the frame it's shown in.
--   mock_photo       text — uploaded flat page screenshot (Storage URL)
--   mockup_template  text — the mockup frame/template id (see MOCKUP_TEMPLATES);
--                            empty shows the raw screenshot with no frame
--
-- Non-destructive and idempotent — safe to re-run.

alter table public.projects
  add column if not exists mock_photo text;
alter table public.projects
  add column if not exists mockup_template text;
