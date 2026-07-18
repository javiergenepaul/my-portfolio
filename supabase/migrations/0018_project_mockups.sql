-- 0018_project_mockups — a reorderable list of framed mockups per project,
-- superseding the single mock_photo/mockup_template and the legacy carousel.
--
-- Stored as jsonb: [{ "id": "...", "template": "monitor", "screenshot": "…" }].
-- Array order is the display sequence (drag-to-reorder in the admin).
--
-- Non-destructive and idempotent — safe to re-run.

-- Ensure the legacy single-mockup columns exist (0017) so the back-fill works
-- even if this runs standalone.
alter table public.projects add column if not exists mock_photo text;
alter table public.projects add column if not exists mockup_template text;

alter table public.projects
  add column if not exists mockups jsonb not null default '[]'::jsonb;

-- Migrate any existing single mockup into the list (only when the list is empty).
update public.projects
set mockups = jsonb_build_array(
  jsonb_build_object(
    'id', gen_random_uuid()::text,
    'template', coalesce(mockup_template, ''),
    'screenshot', mock_photo
  )
)
where coalesce(mock_photo, '') <> ''
  and (mockups is null or mockups = '[]'::jsonb);

-- Back-fill the list from the legacy carousel images as raw, un-framed entries
-- (template = ''), preserving carousel order, for projects still without a list.
update public.projects p
set mockups = coalesce((
  select jsonb_agg(
    jsonb_build_object(
      'id', gen_random_uuid()::text,
      'template', '',
      'screenshot', elem ->> 'image'
    )
    order by ord
  )
  from jsonb_array_elements(p.carousel) with ordinality as t(elem, ord)
  where coalesce(elem ->> 'image', '') <> ''
), '[]'::jsonb)
where (p.mockups is null or p.mockups = '[]'::jsonb)
  and jsonb_typeof(p.carousel) = 'array'
  and jsonb_array_length(p.carousel) > 0;
