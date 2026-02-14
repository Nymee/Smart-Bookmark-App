-- Run this in Supabase SQL Editor (https://supabase.com/dashboard → SQL Editor)

-- 1. Create the bookmarks table
create table if not exists public.bookmarks (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  url        text not null,
  title      text not null,
  created_at timestamptz not null default now()
);

-- 2. Index for fast per-user queries
create index if not exists bookmarks_user_id_idx on public.bookmarks(user_id);

-- 3. Enable Row Level Security
alter table public.bookmarks enable row level security;

-- 4. RLS policies — each user can only see/manage their own bookmarks
create policy "Users can view their own bookmarks"
  on public.bookmarks for select
  using (auth.uid() = user_id);

create policy "Users can insert their own bookmarks"
  on public.bookmarks for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own bookmarks"
  on public.bookmarks for delete
  using (auth.uid() = user_id);

-- 5. Enable Realtime for this table
alter publication supabase_realtime add table public.bookmarks;
