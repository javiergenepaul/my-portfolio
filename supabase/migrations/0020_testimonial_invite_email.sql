-- ─────────────────────────────────────────────────────────────────────────────
-- 0020_testimonial_invite_email — capture the submitter's email
--
-- Needed so the recipient can be notified when their testimonial goes live.
-- Collected on the public form (they enter it themselves), so anon needs an
-- UPDATE grant on the column — the same narrow, column-level grant the rest of
-- the submission payload uses in 0019. Anon still cannot SELECT it back, so one
-- recipient can never read another's address.
-- ─────────────────────────────────────────────────────────────────────────────

alter table public.testimonial_invites
  add column if not exists email text;

grant update (email) on public.testimonial_invites to anon;
