-- Bookmarks table with RLS and policies

-- 1) Tabel
create table if not exists public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  article_id uuid not null references public.articles(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- 2) Uniek per gebruiker + artikel (één bookmark per artikel)
create unique index if not exists bookmarks_user_article_uidx
  on public.bookmarks (user_id, article_id);

-- 3) Handige indexen
create index if not exists bookmarks_user_created_idx
  on public.bookmarks (user_id, created_at desc);

-- 4) RLS aan
alter table public.bookmarks enable row level security;

-- 5) Policies: alleen eigen data
do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'bookmarks' and policyname = 'Select own bookmarks'
  ) then
    create policy "Select own bookmarks"
      on public.bookmarks
      for select
      using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'bookmarks' and policyname = 'Insert own bookmarks'
  ) then
    create policy "Insert own bookmarks"
      on public.bookmarks
      for insert
      with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'bookmarks' and policyname = 'Delete own bookmarks'
  ) then
    create policy "Delete own bookmarks"
      on public.bookmarks
      for delete
      using (auth.uid() = user_id);
  end if;
end $$;


