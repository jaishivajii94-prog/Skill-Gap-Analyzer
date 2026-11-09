-- SkillMap stores one analysis row for each anonymous Supabase user.
-- Run this file in the Supabase SQL Editor after enabling anonymous sign-ins.
create table if not exists public.student_analyses (
  user_id uuid primary key references auth.users (id) on delete cascade,
  profile jsonb not null default '{}'::jsonb,
  career_id text not null check (career_id in ('frontend', 'python', 'data', 'aiml', 'web')),
  current_skills jsonb not null default '{}'::jsonb,
  completed_skills text[] not null default '{}',
  learning_skills text[] not null default '{}',
  updated_at timestamptz not null default now()
);

alter table public.student_analyses enable row level security;

drop policy if exists "Students can read their own analysis" on public.student_analyses;
create policy "Students can read their own analysis"
  on public.student_analyses for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Students can create their own analysis" on public.student_analyses;
create policy "Students can create their own analysis"
  on public.student_analyses for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Students can update their own analysis" on public.student_analyses;
create policy "Students can update their own analysis"
  on public.student_analyses for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Students can delete their own analysis" on public.student_analyses;
create policy "Students can delete their own analysis"
  on public.student_analyses for delete
  to authenticated
  using ((select auth.uid()) = user_id);

grant select, insert, update, delete on public.student_analyses to authenticated;