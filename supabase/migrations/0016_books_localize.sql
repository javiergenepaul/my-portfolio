-- 0016_books_localize — book title and theme are localized too (Japanese
-- titles, translated themes), so widen them from text to per-locale jsonb,
-- wrapping the existing English value as {"en": …}. quote/reflection are
-- already jsonb; author stays plain text (proper noun).
--
-- Run `pnpm seed:book-i18n` afterward to backfill JA/FIL/CEB.

alter table public.books alter column title drop default;
alter table public.books
  alter column title type jsonb using jsonb_build_object('en', title);
alter table public.books alter column title set default '{}'::jsonb;

alter table public.books
  alter column theme type jsonb using jsonb_build_object('en', coalesce(theme, ''));
alter table public.books alter column theme set default '{}'::jsonb;
