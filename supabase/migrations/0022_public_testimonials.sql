-- ─────────────────────────────────────────────────────────────────────────────
-- 0022_public_testimonials — an open, admin-toggled submission link
--
-- Adds a second way in alongside the private per-recipient invite: one fixed
-- URL (/testimonial/share) that anyone can submit through, gated by an on/off
-- switch the admin controls.
--
-- This DELIBERATELY reverses 0019's "anon gets no INSERT" stance — a public
-- link has no admin-created row to update, so a submitter must INSERT their own.
-- Three things keep that safe:
--   1. The insert is only allowed while the toggle is ON — enforced in RLS, not
--      just the UI, so flipping the switch off actually closes the door.
--   2. Anon can only insert status='submitted' + source='public' — it can't
--      self-approve or forge a private invite.
--   3. Nothing reaches the live site without admin approval, exactly like the
--      private flow. Worst case is a noisy review queue, never public spam.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── Distinguish public submissions from admin-created invites ────────────────
alter table public.testimonial_invites
  add column if not exists source text not null default 'invite'
  check (source in ('invite', 'public'));

-- Public inserts don't supply a token (there's no return visit), but the column
-- is NOT NULL UNIQUE — so give it a default. Private invites still pass their
-- own token explicitly, overriding this.
alter table public.testimonial_invites
  alter column token set default replace(gen_random_uuid()::text, '-', '');

-- ── The on/off switch (singleton) ───────────────────────────────────────────
create table if not exists public.testimonial_public (
  id      boolean primary key default true check (id),   -- one row, always id=true
  enabled boolean not null default false,
  updated_at timestamptz not null default now()
);
insert into public.testimonial_public (id, enabled)
  values (true, false)
  on conflict (id) do nothing;

drop trigger if exists set_testimonial_public_updated_at on public.testimonial_public;
create trigger set_testimonial_public_updated_at
  before update on public.testimonial_public
  for each row execute function public.set_updated_at();

alter table public.testimonial_public enable row level security;

-- Anon may read the flag (the form needs to know whether it's open).
drop policy if exists testimonial_public_read on public.testimonial_public;
create policy testimonial_public_read on public.testimonial_public
  for select to anon using (true);

drop policy if exists testimonial_public_admin on public.testimonial_public;
create policy testimonial_public_admin on public.testimonial_public
  for all to authenticated using (true) with check (true);

grant select (enabled) on public.testimonial_public to anon;
grant select, update on public.testimonial_public to authenticated;
grant select, update on public.testimonial_public to service_role;

-- ── Anon INSERT into testimonial_invites — public submissions only ───────────
-- The WITH CHECK is the whole security boundary. It requires the toggle to be
-- ON, and pins status + source, so a public submitter can only ever create a
-- pending public row — never an active invite, never an approved testimonial.
drop policy if exists testimonial_invites_public_insert on public.testimonial_invites;
create policy testimonial_invites_public_insert on public.testimonial_invites
  for insert to anon
  with check (
    source = 'public'
    and status = 'submitted'
    and coalesce((select enabled from public.testimonial_public limit 1), false)
  );

-- Column-level INSERT grant: anon may write only the submission fields. It is
-- deliberately NOT granted token, recipient_*, testimonial_id, or timestamps —
-- token defaults, the rest stay null/default and can't be forged.
grant insert (
  name, email, role, company, relationship, rating, message, photo, links,
  submitted_at, status, source
) on public.testimonial_invites to anon;
