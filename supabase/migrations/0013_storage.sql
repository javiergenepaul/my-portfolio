-- 0013_storage — public "content" bucket for admin-uploaded images.
--
-- First use: stack/skill icons. Reused later for any image field (org logos,
-- avatar, …). Public READ (so <img src> works and pages stay static/ISR), but
-- WRITES are restricted to the authenticated admin — never anon, never public.

insert into storage.buckets (id, name, public)
values ('content', 'content', true)
on conflict (id) do nothing;

-- Public read (public buckets are already served via the public URL; this also
-- allows anon/authenticated reads through the API).
drop policy if exists "content_public_read" on storage.objects;
create policy "content_public_read" on storage.objects
  for select to anon, authenticated using (bucket_id = 'content');

-- Admin-only writes.
drop policy if exists "content_admin_insert" on storage.objects;
create policy "content_admin_insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'content');

drop policy if exists "content_admin_update" on storage.objects;
create policy "content_admin_update" on storage.objects
  for update to authenticated
  using (bucket_id = 'content') with check (bucket_id = 'content');

drop policy if exists "content_admin_delete" on storage.objects;
create policy "content_admin_delete" on storage.objects
  for delete to authenticated using (bucket_id = 'content');
