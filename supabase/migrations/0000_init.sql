-- ─────────────────────────────────────────────────────────────────────────────
-- 0000_init — shared helpers for every content table
--
-- Each content type gets its own typed table (see 0001+). They all share the
-- same four housekeeping columns and the same security posture, so the
-- boilerplate lives here instead of being copy-pasted 17 times:
--
--   every table has: id, published, sort_order, created_at, updated_at
--   every table gets: updated_at trigger, RLS, policies, grants
--
-- Column naming: snake_case of the field names in
-- src/components/admin/admin-config.ts (e.g. employmentType → employment_type),
-- which lets one generic mapper serve every table.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── updated_at ──────────────────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ── Standard security + housekeeping for a content table ────────────────────
-- anon          → PUBLISHED rows only (what the public portfolio renders)
-- authenticated → everything, incl. drafts, plus writes
--
-- NOTE: treats "authenticated" as "the admin" — true because exactly one
-- account exists and public sign-up is disabled in Supabase Auth. If more users
-- are ever added, swap the admin policy for an admins table + is_admin().
--
-- Grants are explicit because this project has "automatically expose new
-- tables" turned OFF. Grants decide reachability; RLS decides what's returned.
create or replace function public.setup_content_table(t text)
returns void
language plpgsql
as $$
begin
  execute format('alter table public.%I enable row level security', t);

  -- Policy names are identifiers (%I), not string literals (%L).
  execute format('drop policy if exists %I on public.%I', t || '_public_read', t);
  execute format(
    'create policy %I on public.%I for select to anon using (published)',
    t || '_public_read', t
  );

  execute format('drop policy if exists %I on public.%I', t || '_admin_all', t);
  execute format(
    'create policy %I on public.%I for all to authenticated using (true) with check (true)',
    t || '_admin_all', t
  );

  execute format('grant select on public.%I to anon', t);
  execute format('grant select, insert, update, delete on public.%I to authenticated', t);
  -- service_role needs an explicit grant too: with "automatically expose new
  -- tables" OFF, a new table is granted to nobody. It's the server-only key
  -- (bypasses RLS by design) used for seeding/maintenance scripts.
  execute format('grant all privileges on public.%I to service_role', t);

  execute format('drop trigger if exists %I on public.%I', t || '_set_updated_at', t);
  execute format(
    'create trigger %I before update on public.%I for each row execute function public.set_updated_at()',
    t || '_set_updated_at', t
  );

  execute format('create index if not exists %I on public.%I (sort_order)', t || '_sort_idx', t);
end;
$$;
