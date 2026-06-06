-- Run this in your Supabase SQL editor

-- Profiles table (extends auth.users)
create table if not exists profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  handle text unique not null,
  email text not null,
  created_at timestamptz default now()
);

-- Bookmarks table
create table if not exists bookmarks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  url text not null,
  favicon_url text,
  is_public boolean default false not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes
create index if not exists bookmarks_user_id_idx on bookmarks(user_id);
create index if not exists bookmarks_created_at_idx on bookmarks(created_at desc);
create index if not exists profiles_handle_idx on profiles(handle);

-- RLS
alter table profiles enable row level security;
alter table bookmarks enable row level security;

-- Profiles policies
-- Anyone can look up a profile by handle (needed for public profile page)
create policy "profiles_public_select" on profiles
  for select using (true);

-- Users can only update their own profile
create policy "profiles_owner_update" on profiles
  for update using (auth.uid() = id);

-- Only the trigger/service role inserts profiles (via signup action)
-- We use service role in the signup server action, so this policy is for anon/authed fallback
create policy "profiles_owner_insert" on profiles
  for insert with check (auth.uid() = id);

-- Bookmarks policies
-- Owners see all their own bookmarks
create policy "bookmarks_owner_select" on bookmarks
  for select using (auth.uid() = user_id);

-- Anyone sees public bookmarks (for public profile pages)
create policy "bookmarks_public_select" on bookmarks
  for select using (is_public = true);

-- Owners insert their own
create policy "bookmarks_owner_insert" on bookmarks
  for insert with check (auth.uid() = user_id);

-- Owners update their own
create policy "bookmarks_owner_update" on bookmarks
  for update using (auth.uid() = user_id);

-- Owners delete their own
create policy "bookmarks_owner_delete" on bookmarks
  for delete using (auth.uid() = user_id);
