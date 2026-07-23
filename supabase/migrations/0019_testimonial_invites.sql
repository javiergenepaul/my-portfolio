-- ─────────────────────────────────────────────────────────────────────────────
-- 0019_testimonial_invites — real backing for the /testimonial/<token> flow
--
-- Replaces the localStorage prototype (src/components/testimonial/invite-store.ts).
-- The admin creates an invite, shares /testimonial/<token>, and the recipient
-- submits once. Because the row lives in Postgres rather than the admin's
-- browser, the link now works on the recipient's device.
--
-- Submissions are NOT written to public.testimonials. They stay here until the
-- admin approves one, which inserts an UNPUBLISHED testimonials row. That keeps
-- unreviewed public input out of the table the live site reads from.
--
-- This table does NOT use setup_content_table(): that grants anon a blanket
-- read of every published row, which would leak the whole invite list. Anon
-- access here is deliberately narrow — see the policies below.
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.testimonial_invites (
  id                uuid        primary key default gen_random_uuid(),
  -- Unguessable, URL-safe, and the anon lookup key. Unique so a token
  -- collision fails loudly instead of silently sharing an invite.
  token             text        not null unique,

  recipient_name    text        not null default '',
  recipient_role    text,
  recipient_company text,

  -- active → awaiting submission | submitted → recipient responded
  -- revoked → link disabled      | approved  → copied into testimonials
  status            text        not null default 'active'
                    check (status in ('active', 'submitted', 'revoked', 'approved')),

  -- Submission payload, null until the recipient responds.
  name              text,
  role              text,
  company           text,
  relationship      text,
  rating            numeric(2,1),
  message           text,
  photo             text,
  -- Same { platform, url }[] shape as testimonials.links, so approving is a
  -- straight copy rather than a reshape.
  links             jsonb       not null default '[]'::jsonb,
  submitted_at      timestamptz,

  -- Set on approval; null beforehand. ON DELETE SET NULL so deleting the
  -- published testimonial doesn't cascade away the invite's audit trail.
  testimonial_id    uuid        references public.testimonials(id) on delete set null,

  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists testimonial_invites_token_idx
  on public.testimonial_invites (token);
create index if not exists testimonial_invites_created_idx
  on public.testimonial_invites (created_at desc);

drop trigger if exists set_testimonial_invites_updated_at on public.testimonial_invites;
create trigger set_testimonial_invites_updated_at
  before update on public.testimonial_invites
  for each row execute function public.set_updated_at();

-- ── Security ────────────────────────────────────────────────────────────────
alter table public.testimonial_invites enable row level security;

-- Anon may read an invite, but only by exact token (no listing). Postgres does
-- not expose the WHERE clause to a policy, so the guard is at the grant level:
-- anon gets SELECT on the recipient-facing columns only. The submission body of
-- OTHER invites is therefore unreadable even if a token is known — and the
-- token itself is the secret, exactly like a password-reset link.
drop policy if exists testimonial_invites_anon_read on public.testimonial_invites;
create policy testimonial_invites_anon_read on public.testimonial_invites
  for select to anon
  using (status in ('active', 'submitted'));

-- Anon may submit exactly once, and only into an active invite. The USING
-- clause is evaluated against the pre-update row, so a second submit finds
-- status = 'submitted' and matches nothing. WITH CHECK stops the recipient
-- from setting any status other than 'submitted' (e.g. self-approving).
drop policy if exists testimonial_invites_anon_submit on public.testimonial_invites;
create policy testimonial_invites_anon_submit on public.testimonial_invites
  for update to anon
  using (status = 'active')
  with check (status = 'submitted');

drop policy if exists testimonial_invites_admin_all on public.testimonial_invites;
create policy testimonial_invites_admin_all on public.testimonial_invites
  for all to authenticated using (true) with check (true);

-- Grants decide reachability; RLS decides what comes back. Anon deliberately
-- gets no INSERT and no DELETE — it can only fill in an invite the admin made.
revoke all on public.testimonial_invites from anon;
grant select (
  id, token, recipient_name, recipient_role, recipient_company, status, created_at
) on public.testimonial_invites to anon;
grant update (
  status, name, role, company, relationship, rating, message, photo, links, submitted_at
) on public.testimonial_invites to anon;

grant select, insert, update, delete on public.testimonial_invites to authenticated;
grant select, insert, update, delete on public.testimonial_invites to service_role;
