-- Optional table for capturing auth/profile debug events (opt-in)
create table if not exists public.debug_profile_events (
  id bigserial primary key,
  created_at timestamptz not null default now(),
  user_id uuid null references auth.users(id) on delete set null,
  trace_id text not null,
  context text not null,
  event text not null,
  payload jsonb
);

alter table public.debug_profile_events enable row level security;

-- Allow users to insert their own debug events (optional)
create policy if not exists "Users can insert own debug events"
on public.debug_profile_events
for insert
with check (auth.uid() = user_id);

-- Allow reading only own events (optional)
create policy if not exists "Users can read own debug events"
on public.debug_profile_events
for select
using (auth.uid() = user_id);


