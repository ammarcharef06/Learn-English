create extension if not exists pgcrypto;

create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  name text not null default '',
  goal text not null default 'interview'
    check (goal in ('interview', 'travel', 'immigration', 'work', 'study')),
  target_date date,
  onboarding_data jsonb,
  xp integer not null default 0 check (xp >= 0),
  streak integer not null default 0 check (streak >= 0),
  completed_lesson_ids jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.users
  drop constraint if exists users_goal_check;
alter table public.users
  add constraint users_goal_check
  check (goal in ('interview', 'travel', 'immigration', 'work', 'study'));
alter table public.users
  add column if not exists onboarding_data jsonb;
alter table public.users
  add column if not exists completed_lesson_ids jsonb not null default '[]'::jsonb;

create table if not exists public.levels (
  id text primary key,
  title text not null,
  sort_order integer not null unique
);

create table if not exists public.units (
  id text primary key,
  level_id text not null references public.levels (id) on delete cascade,
  title text not null,
  sort_order integer not null,
  unique (level_id, sort_order)
);

create table if not exists public.lessons (
  id text primary key,
  unit_id text not null references public.units (id) on delete cascade,
  title text not null,
  lesson_type text not null default 'role_play'
    check (lesson_type in ('phonics', 'sentence_builder', 'role_play', 'essay_analysis')),
  scenario text not null default '',
  assessment jsonb not null default '[]'::jsonb,
  sort_order integer not null,
  unique (unit_id, sort_order)
);

alter table public.lessons
  add column if not exists lesson_type text not null default 'role_play'
  check (lesson_type in ('phonics', 'sentence_builder', 'role_play', 'essay_analysis'));

create table if not exists public.flashcards (
  id text primary key,
  lesson_id text not null references public.lessons (id) on delete cascade,
  question text not null,
  answer text not null,
  phonetic text not null default '',
  audio_url text
);

create table if not exists public.user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  flashcard_id text not null references public.flashcards (id) on delete cascade,
  next_review_date date not null,
  interval integer not null default 0 check (interval >= 0),
  ease_factor numeric(4, 2) not null default 2.50 check (ease_factor >= 1.30),
  repetitions integer not null default 0 check (repetitions >= 0),
  updated_at timestamptz not null default now(),
  unique (user_id, flashcard_id)
);

alter table public.user_progress
  add column if not exists updated_at timestamptz not null default now();

create index if not exists user_progress_due_idx
  on public.user_progress (user_id, next_review_date);

alter table public.users enable row level security;
alter table public.levels enable row level security;
alter table public.units enable row level security;
alter table public.lessons enable row level security;
alter table public.flashcards enable row level security;
alter table public.user_progress enable row level security;

drop policy if exists "Users can read their own profile" on public.users;
create policy "Users can read their own profile"
  on public.users for select using (auth.uid() = id);
drop policy if exists "Users can insert their own profile" on public.users;
create policy "Users can insert their own profile"
  on public.users for insert with check (auth.uid() = id);
drop policy if exists "Users can update their own profile" on public.users;
create policy "Users can update their own profile"
  on public.users for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "Curriculum is readable" on public.levels;
create policy "Curriculum is readable" on public.levels for select using (true);
drop policy if exists "Units are readable" on public.units;
create policy "Units are readable" on public.units for select using (true);
drop policy if exists "Lessons are readable" on public.lessons;
create policy "Lessons are readable" on public.lessons for select using (true);
drop policy if exists "Flashcards are readable" on public.flashcards;
create policy "Flashcards are readable" on public.flashcards for select using (true);

drop policy if exists "Users can read their own card progress" on public.user_progress;
create policy "Users can read their own card progress"
  on public.user_progress for select using (auth.uid() = user_id);
drop policy if exists "Users can insert their own card progress" on public.user_progress;
create policy "Users can insert their own card progress"
  on public.user_progress for insert with check (auth.uid() = user_id);
drop policy if exists "Users can update their own card progress" on public.user_progress;
create policy "Users can update their own card progress"
  on public.user_progress for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "Users can delete their own card progress" on public.user_progress;
create policy "Users can delete their own card progress"
  on public.user_progress for delete using (auth.uid() = user_id);
