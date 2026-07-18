-- 0016_books_localize — book title and theme are localized too (Japanese
-- titles, translated themes), so widen them from text to per-locale jsonb,
-- wrapping the existing English value as {"en": …}. quote/reflection are
-- already jsonb; author stays plain text (proper noun).
--
-- Idempotent: each column is only converted while it is still typed `text`,
-- so re-running is a safe no-op (and can't double-wrap an already-jsonb value).
--
-- Run `pnpm seed:book-i18n` afterward to backfill JA/FIL/CEB.

do $$
begin
  if (select data_type
        from information_schema.columns
       where table_schema = 'public'
         and table_name   = 'books'
         and column_name  = 'title') = 'text'
  then
    alter table public.books alter column title drop default;
    alter table public.books
      alter column title type jsonb using jsonb_build_object('en', title);
    alter table public.books alter column title set default '{}'::jsonb;
  end if;

  if (select data_type
        from information_schema.columns
       where table_schema = 'public'
         and table_name   = 'books'
         and column_name  = 'theme') = 'text'
  then
    alter table public.books
      alter column theme type jsonb using jsonb_build_object('en', coalesce(theme, ''));
    alter table public.books alter column theme set default '{}'::jsonb;
  end if;
end $$;
