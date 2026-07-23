-- 003_admin_panel.sql
-- Admin panel: profiles, chapters, exercises, content_versions

-- 1. Profiles (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role text not null default 'editor' check (role in ('admin', 'editor')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Admins can view all profiles"
  on public.profiles for select
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Users can update own display_name"
  on public.profiles for update
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    and (
      coalesce(role, 'editor') = (select role from public.profiles where id = auth.uid())
    )
  );

create policy "Admins can update all profiles"
  on public.profiles for update
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- 2. Chapters
create table if not exists public.chapters (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  subtitle text,
  part text not null,
  group_id text,
  order_index integer not null,
  content_markdown text not null default '',
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles(id)
);

alter table public.chapters enable row level security;

create policy "Authenticated can read chapters"
  on public.chapters for select
  to authenticated
  using (true);

create policy "Editors can insert chapters"
  on public.chapters for insert
  to authenticated
  with check (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'editor'))
  );

create policy "Editors can update chapters"
  on public.chapters for update
  to authenticated
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'editor'))
  );

create policy "Editors can delete chapters"
  on public.chapters for delete
  to authenticated
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'editor'))
  );

-- 3. Content versions
create table if not exists public.content_versions (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references public.chapters(id) on delete cascade,
  content_markdown text not null,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  change_summary text
);

alter table public.content_versions enable row level security;

create policy "Editors can insert versions"
  on public.content_versions for insert
  to authenticated
  with check (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'editor'))
  );

create policy "Editors can read versions"
  on public.content_versions for select
  to authenticated
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'editor'))
  );

-- 4. Exercises
create table if not exists public.exercises (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  category text not null,
  muscles text[] not null default '{}',
  difficulty text not null default 'Intermediário',
  description text not null default '',
  full_description text not null default '',
  tips text[] not null default '{}',
  is_published boolean not null default false,
  order_index integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.exercises enable row level security;

create policy "Authenticated can read exercises"
  on public.exercises for select
  to authenticated
  using (true);

create policy "Editors can insert exercises"
  on public.exercises for insert
  to authenticated
  with check (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'editor'))
  );

create policy "Editors can update exercises"
  on public.exercises for update
  to authenticated
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'editor'))
  );

create policy "Editors can delete exercises"
  on public.exercises for delete
  to authenticated
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'editor'))
  );
