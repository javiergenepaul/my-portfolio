-- ─────────────────────────────────────────────────────────────────────────────
-- 0021_testimonial_avatar_url — real photos for testimonials
--
-- `testimonials.avatar` is rendered as TEXT inside a coloured circle by every
-- year, so it holds initials ("RL"). It is NOT an image field, and writing a
-- base64 data URI into it printed ~85k characters across the page.
--
-- Photos get their own column holding a Supabase Storage URL. The card shows
-- the image when set and falls back to `avatar` initials when not, so existing
-- testimonials keep working untouched.
--
-- The invite's `photo` column now stores that same URL instead of base64 — the
-- upload happens through a server action (see lib/testimonials/upload.ts),
-- because the `content` bucket only allows authenticated writes and the
-- submitter is anon.
-- ─────────────────────────────────────────────────────────────────────────────

alter table public.testimonials
  add column if not exists avatar_url text;

-- Repair the row written before photos had their own column: keep the person,
-- drop the base64 blob, and let the mapper derive initials from the name.
update public.testimonials
set avatar = null
where avatar like 'data:%';
