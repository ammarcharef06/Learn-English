-- Optional social layer. Existing local progress/settings tables and keys are untouched.
create extension if not exists pgcrypto;

create table if not exists public.community_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null check (char_length(display_name) between 2 and 40),
  level text not null default 'A1' check (level in ('A0', 'A1', 'A2', 'B1')),
  locale text not null default 'ar' check (locale in ('ar', 'en')),
  discoverable boolean not null default true,
  xp integer not null default 0 check (xp >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.community_rooms (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('topic', 'direct')),
  slug text unique,
  title_en text,
  title_ar text,
  level text check (level is null or level in ('A0', 'A1', 'A2', 'B1')),
  topic text,
  direct_pair text unique,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  check (
    (kind = 'topic' and slug is not null and title_en is not null and title_ar is not null and direct_pair is null)
    or (kind = 'direct' and slug is null and title_en is null and title_ar is null and direct_pair is not null)
  )
);

create table if not exists public.community_room_members (
  room_id uuid not null references public.community_rooms (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (room_id, user_id)
);

create table if not exists public.community_blocks (
  blocker_id uuid not null references auth.users (id) on delete cascade,
  blocked_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker_id, blocked_id),
  check (blocker_id <> blocked_id)
);

create table if not exists public.community_messages (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.community_rooms (id) on delete cascade,
  sender_id uuid not null references auth.users (id) on delete cascade,
  body text check (body is null or char_length(body) between 1 and 2000),
  voice_path text,
  reply_to uuid references public.community_messages (id) on delete set null,
  created_at timestamptz not null default now(),
  check (nullif(btrim(body), '') is not null or voice_path is not null),
  check (voice_path is null or char_length(voice_path) <= 180)
);
create index if not exists community_messages_room_created_idx
  on public.community_messages (room_id, created_at desc);

create table if not exists public.community_reactions (
  message_id uuid not null references public.community_messages (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  reaction text not null check (reaction in ('support', 'helpful')),
  created_at timestamptz not null default now(),
  primary key (message_id, user_id)
);

create table if not exists public.community_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references auth.users (id) on delete cascade,
  target_user_id uuid references auth.users (id) on delete set null,
  message_id uuid references public.community_messages (id) on delete set null,
  reason text not null check (reason in ('spam', 'harassment', 'inappropriate', 'other')),
  details text check (details is null or char_length(details) <= 500),
  status text not null default 'open' check (status in ('open', 'reviewing', 'resolved', 'dismissed')),
  created_at timestamptz not null default now(),
  check (target_user_id is not null or message_id is not null)
);
create index if not exists community_reports_open_idx
  on public.community_reports (created_at desc) where status = 'open';

create table if not exists public.community_xp_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  event_type text not null check (event_type in ('message', 'support')),
  reference_id uuid not null,
  points smallint not null check (points between 1 and 5),
  created_at timestamptz not null default now(),
  unique (user_id, event_type, reference_id)
);
create index if not exists community_xp_user_created_idx
  on public.community_xp_events (user_id, created_at desc);

create table if not exists public.community_blocked_terms (
  term text primary key check (char_length(term) between 2 and 80)
);

create table if not exists public.community_ai_usage (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  action text not null check (action in ('translate', 'correct', 'starters')),
  created_at timestamptz not null default now()
);
create index if not exists community_ai_usage_user_created_idx
  on public.community_ai_usage (user_id, created_at desc);

insert into public.community_blocked_terms (term) values
  ('fuck'), ('shit'), ('bitch'), ('bastard'), ('asshole'),
  ('كلب'), ('حمار'), ('حقير')
on conflict do nothing;

insert into public.community_rooms (kind, slug, title_en, title_ar, level, topic) values
  ('topic', 'a0-foundations', 'A0 Foundations', 'تأسيس من الصفر A0', 'A0', 'foundations'),
  ('topic', 'a1-beginners', 'A1 Beginners', 'مبتدئو A1', 'A1', 'beginners'),
  ('topic', 'a2-pre-intermediate', 'A2 Pre-intermediate', 'ما قبل المتوسط A2', 'A2', 'intermediate'),
  ('topic', 'b1-intermediate', 'B1 Intermediate', 'المستوى المتوسط B1', 'B1', 'intermediate'),
  ('topic', 'speaking-practice', 'Speaking practice', 'تدريب المحادثة', null, 'speaking'),
  ('topic', 'grammar-corner', 'Grammar corner', 'ركن القواعد', null, 'grammar'),
  ('topic', 'daily-english', 'Everyday English', 'الإنجليزية اليومية', null, 'daily'),
  ('topic', 'study-buddies', 'Find a study buddy', 'ابحث عن شريك تعلّم', null, 'study-buddy')
on conflict (slug) do update set
  title_en = excluded.title_en,
  title_ar = excluded.title_ar,
  level = excluded.level,
  topic = excluded.topic;

create or replace function public.community_touch_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create or replace function public.community_can_view_profile(p_user_id uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select p_user_id = (select auth.uid())
    or exists (
      select 1 from public.community_profiles p
      where p.id = p_user_id and p.discoverable
    )
    or exists (
      select 1
      from public.community_room_members own_member
      join public.community_room_members other_member using (room_id)
      join public.community_rooms r on r.id = own_member.room_id and r.kind = 'direct'
      where own_member.user_id = (select auth.uid())
        and other_member.user_id = p_user_id
    );
$$;

drop trigger if exists community_profiles_touch on public.community_profiles;
create trigger community_profiles_touch before update on public.community_profiles
for each row execute function public.community_touch_updated_at();

create or replace function public.community_profile_on_signup()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  wanted_name text;
begin
  wanted_name := nullif(btrim(new.raw_user_meta_data ->> 'display_name'), '');
  if wanted_name is null or char_length(wanted_name) not between 2 and 40 then
    wanted_name := 'Learner ' || left(new.id::text, 6);
  end if;
  insert into public.community_profiles (id, display_name)
  values (new.id, wanted_name)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists community_auth_user_created on auth.users;
create trigger community_auth_user_created after insert on auth.users
for each row execute function public.community_profile_on_signup();

create or replace function public.community_is_member(p_room_id uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.community_room_members m
    where m.room_id = p_room_id and m.user_id = (select auth.uid())
  );
$$;

create or replace function public.community_is_blocked(p_user_id uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.community_blocks b
    where (b.blocker_id = (select auth.uid()) and b.blocked_id = p_user_id)
       or (b.blocker_id = p_user_id and b.blocked_id = (select auth.uid()))
  );
$$;

create or replace function public.community_contains_blocked_term(p_text text)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1
    from public.community_blocked_terms t
    where lower(regexp_replace(translate(coalesce(p_text, ''), 'ًٌٍَُِّْٰـ', ''), '[^[:alnum:]]+', '', 'g'))
      like ('%' || lower(t.term) || '%')
  );
$$;

create or replace function public.community_join_topic(p_room_id uuid)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if (select auth.uid()) is null then raise exception 'Sign in to join a room.'; end if;
  if not exists (
    select 1 from public.community_rooms r where r.id = p_room_id and r.kind = 'topic'
  ) then raise exception 'This room is not available.'; end if;
  insert into public.community_room_members (room_id, user_id)
  values (p_room_id, (select auth.uid())) on conflict do nothing;
end;
$$;

create or replace function public.community_open_direct(p_target_user_id uuid)
returns uuid language plpgsql security definer set search_path = '' as $$
declare
  caller uuid := (select auth.uid());
  pair_key text;
  new_room_id uuid;
begin
  if caller is null then raise exception 'Sign in to contact a learner.'; end if;
  if p_target_user_id is null or p_target_user_id = caller then
    raise exception 'Choose another learner.';
  end if;
  if not exists (
    select 1 from public.community_profiles p
    where p.id = p_target_user_id and p.discoverable
  ) then raise exception 'This learner is not available.'; end if;
  if exists (
    select 1 from public.community_blocks b
    where (b.blocker_id = caller and b.blocked_id = p_target_user_id)
       or (b.blocker_id = p_target_user_id and b.blocked_id = caller)
  ) then raise exception 'This conversation is unavailable.'; end if;

  pair_key := least(caller::text, p_target_user_id::text) || ':' ||
    greatest(caller::text, p_target_user_id::text);
  insert into public.community_rooms (kind, direct_pair, created_by)
  values ('direct', pair_key, caller)
  on conflict (direct_pair) do update set direct_pair = excluded.direct_pair
  returning id into new_room_id;

  insert into public.community_room_members (room_id, user_id)
  values (new_room_id, caller), (new_room_id, p_target_user_id)
  on conflict do nothing;
  return new_room_id;
end;
$$;

create or replace function public.community_send_message(
  p_room_id uuid,
  p_body text default null,
  p_voice_path text default null,
  p_reply_to uuid default null
)
returns public.community_messages language plpgsql security definer set search_path = '' as $$
declare
  caller uuid := (select auth.uid());
  clean_body text := nullif(btrim(p_body), '');
  room_kind text;
  inserted_message public.community_messages;
begin
  if caller is null then raise exception 'Sign in to send a message.'; end if;
  if not public.community_is_member(p_room_id) then raise exception 'Join this room before messaging.'; end if;
  if char_length(coalesce(clean_body, '')) > 2000 then raise exception 'Messages must be 2000 characters or fewer.'; end if;
  if clean_body is null and p_voice_path is null then raise exception 'Write a message or attach a voice note.'; end if;
  if public.community_contains_blocked_term(clean_body) then
    raise exception 'Please rephrase your message respectfully.';
  end if;
  if p_voice_path is not null and p_voice_path !~
    ('^' || p_room_id::text || '/' || caller::text || '/[a-f0-9-]{36}\.(webm|m4a|mp4|ogg)$') then
    raise exception 'Invalid voice note path.';
  end if;
  if p_reply_to is not null and not exists (
    select 1 from public.community_messages m where m.id = p_reply_to and m.room_id = p_room_id
  ) then raise exception 'The replied-to message is unavailable.'; end if;

  perform pg_advisory_xact_lock(hashtextextended('community-message:' || caller::text, 0));
  if (select count(*) from public.community_messages
      where sender_id = caller and created_at >= now() - interval '10 seconds') >= 5 then
    raise exception 'Please wait before sending more messages.';
  end if;

  select kind into room_kind from public.community_rooms where id = p_room_id;
  if room_kind = 'direct' and exists (
    select 1 from public.community_room_members m
    join public.community_blocks b on
      (b.blocker_id = caller and b.blocked_id = m.user_id)
      or (b.blocker_id = m.user_id and b.blocked_id = caller)
    where m.room_id = p_room_id and m.user_id <> caller
  ) then raise exception 'This conversation is unavailable.'; end if;

  insert into public.community_messages (room_id, sender_id, body, voice_path, reply_to)
  values (p_room_id, caller, clean_body, p_voice_path, p_reply_to)
  returning * into inserted_message;

  if clean_body is not null and char_length(clean_body) >= 20 then
    perform pg_advisory_xact_lock(hashtextextended(caller::text, 0));
    if (select coalesce(sum(points), 0) from public.community_xp_events
        where user_id = caller and created_at >= date_trunc('day', now())) < 20 then
      insert into public.community_xp_events (user_id, event_type, reference_id, points)
      values (caller, 'message', inserted_message.id, 1) on conflict do nothing;
      update public.community_profiles set xp = xp + 1 where id = caller;
    end if;
  end if;
  return inserted_message;
end;
$$;

create or replace function public.community_react(p_message_id uuid, p_reaction text)
returns void language plpgsql security definer set search_path = '' as $$
declare
  caller uuid := (select auth.uid());
  author_id uuid;
begin
  if caller is null then raise exception 'Sign in to react.'; end if;
  if p_reaction not in ('support', 'helpful') then raise exception 'Invalid reaction.'; end if;
  select sender_id into author_id from public.community_messages where id = p_message_id;
  if author_id is null or author_id = caller then raise exception 'This message cannot be reacted to.'; end if;
  if public.community_is_blocked(author_id) then raise exception 'This message is unavailable.'; end if;
  insert into public.community_reactions (message_id, user_id, reaction)
  values (p_message_id, caller, p_reaction)
  on conflict (message_id, user_id) do update set reaction = excluded.reaction;
  if p_reaction = 'support' then
    perform pg_advisory_xact_lock(hashtextextended('community-xp:' || author_id::text, 0));
    if (select coalesce(sum(points), 0) from public.community_xp_events
        where user_id = author_id and created_at >= date_trunc('day', now())) <= 18 then
      insert into public.community_xp_events (user_id, event_type, reference_id, points)
      values (author_id, 'support', p_message_id, 2) on conflict do nothing;
      if found then update public.community_profiles set xp = xp + 2 where id = author_id; end if;
    end if;
  end if;
end;
$$;

alter table public.community_profiles enable row level security;
alter table public.community_rooms enable row level security;
alter table public.community_room_members enable row level security;
alter table public.community_blocks enable row level security;
alter table public.community_messages enable row level security;
alter table public.community_reactions enable row level security;
alter table public.community_reports enable row level security;
alter table public.community_xp_events enable row level security;
alter table public.community_blocked_terms enable row level security;

drop policy if exists "Discoverable profiles are visible" on public.community_profiles;
create policy "Discoverable profiles are visible" on public.community_profiles
for select to authenticated using (public.community_can_view_profile(id));
drop policy if exists "Users update own community profile" on public.community_profiles;
create policy "Users update own community profile" on public.community_profiles
for update to authenticated using (id = (select auth.uid()))
with check (id = (select auth.uid()));
revoke update on public.community_profiles from authenticated;
grant update (display_name, level, locale, discoverable) on public.community_profiles to authenticated;

drop policy if exists "Members and topic rooms are visible" on public.community_rooms;
create policy "Members and topic rooms are visible" on public.community_rooms
for select to authenticated using (
  (kind = 'topic' and (select auth.uid()) is not null)
  or public.community_is_member(id)
);

drop policy if exists "Room participants are visible to members" on public.community_room_members;
create policy "Room participants are visible to members" on public.community_room_members
for select to authenticated using (public.community_is_member(room_id));

drop policy if exists "Users manage their own blocks" on public.community_blocks;
create policy "Users manage their own blocks" on public.community_blocks
for select to authenticated using (blocker_id = (select auth.uid()));
create policy "Users create their own blocks" on public.community_blocks
for insert to authenticated with check (blocker_id = (select auth.uid()) and blocked_id <> (select auth.uid()));
create policy "Users remove their own blocks" on public.community_blocks
for delete to authenticated using (blocker_id = (select auth.uid()));

drop policy if exists "Room members read permitted messages" on public.community_messages;
create policy "Room members read permitted messages" on public.community_messages
for select to authenticated using (
  public.community_is_member(room_id) and not public.community_is_blocked(sender_id)
);

drop policy if exists "Members see reactions in their rooms" on public.community_reactions;
create policy "Members see reactions in their rooms" on public.community_reactions
for select to authenticated using (
  exists (select 1 from public.community_messages m
    where m.id = message_id and public.community_is_member(m.room_id))
);

drop policy if exists "Users see their own reports" on public.community_reports;
create policy "Users see their own reports" on public.community_reports
for select to authenticated using (reporter_id = (select auth.uid()));
drop policy if exists "Users submit reports" on public.community_reports;
create policy "Users submit reports" on public.community_reports
for insert to authenticated with check (
  reporter_id = (select auth.uid())
  and (target_user_id is null or target_user_id <> (select auth.uid()))
);

drop policy if exists "Users see their own XP events" on public.community_xp_events;
create policy "Users see their own XP events" on public.community_xp_events
for select to authenticated using (user_id = (select auth.uid()));

create or replace function public.community_report(
  p_target_user_id uuid default null,
  p_message_id uuid default null,
  p_reason text default 'other',
  p_details text default null
)
returns uuid language plpgsql security definer set search_path = '' as $$
declare
  caller uuid := (select auth.uid());
  reported_user uuid := p_target_user_id;
  report_id uuid;
begin
  if caller is null then raise exception 'Sign in to report content.'; end if;
  perform pg_advisory_xact_lock(hashtextextended('community-report:' || caller::text, 0));
  if (select count(*) from public.community_reports
      where reporter_id = caller and created_at >= now() - interval '10 minutes') >= 10 then
    raise exception 'Please wait before submitting another report.';
  end if;
  if p_message_id is not null then
    select sender_id into reported_user from public.community_messages where id = p_message_id;
    if reported_user is null then raise exception 'This message is unavailable.'; end if;
  end if;
  if reported_user = caller then raise exception 'You cannot report yourself.'; end if;
  if p_reason not in ('spam', 'harassment', 'inappropriate', 'other') then raise exception 'Invalid report reason.'; end if;
  insert into public.community_reports (reporter_id, target_user_id, message_id, reason, details)
  values (caller, reported_user, p_message_id, p_reason, left(btrim(coalesce(p_details, '')), 500))
  returning id into report_id;
  return report_id;
end;
$$;

create or replace function public.community_ai_allow(p_action text)
returns boolean language plpgsql security definer set search_path = '' as $$
declare
  caller uuid := (select auth.uid());
  recent_count integer;
begin
  if caller is null then raise exception 'Sign in to use community AI tools.'; end if;
  if p_action not in ('translate', 'correct', 'starters') then raise exception 'Invalid AI action.'; end if;
  perform pg_advisory_xact_lock(hashtextextended('community-ai:' || caller::text, 0));
  select count(*) into recent_count
  from public.community_ai_usage
  where user_id = caller and created_at >= now() - interval '1 minute';
  if recent_count >= 5 then return false; end if;
  select count(*) into recent_count
  from public.community_ai_usage
  where user_id = caller and created_at >= date_trunc('day', now());
  if recent_count >= 30 then return false; end if;
  insert into public.community_ai_usage (user_id, action) values (caller, p_action);
  return true;
end;
$$;

alter table public.community_ai_usage enable row level security;

revoke all on public.community_profiles, public.community_rooms, public.community_room_members,
  public.community_blocks, public.community_messages, public.community_reactions,
  public.community_reports, public.community_xp_events, public.community_blocked_terms,
  public.community_ai_usage from anon, authenticated;
grant select on public.community_profiles, public.community_rooms, public.community_room_members,
  public.community_messages, public.community_reactions, public.community_reports,
  public.community_xp_events to authenticated;
grant insert, delete on public.community_blocks to authenticated;

revoke all on function public.community_touch_updated_at() from public, anon, authenticated;
revoke all on function public.community_profile_on_signup() from public, anon, authenticated;
revoke all on function public.community_can_view_profile(uuid) from public, anon, authenticated;
revoke all on function public.community_contains_blocked_term(text) from public, anon, authenticated;
revoke all on function public.community_is_member(uuid) from public, anon, authenticated;
revoke all on function public.community_is_blocked(uuid) from public, anon, authenticated;
grant execute on function public.community_can_view_profile(uuid) to authenticated;
grant execute on function public.community_is_member(uuid) to authenticated;
grant execute on function public.community_is_blocked(uuid) to authenticated;

revoke all on function public.community_join_topic(uuid) from public;
revoke all on function public.community_open_direct(uuid) from public;
revoke all on function public.community_send_message(uuid, text, text, uuid) from public;
revoke all on function public.community_react(uuid, text) from public;
revoke all on function public.community_report(uuid, uuid, text, text) from public;
revoke all on function public.community_ai_allow(text) from public;
grant execute on function public.community_join_topic(uuid) to authenticated;
grant execute on function public.community_open_direct(uuid) to authenticated;
grant execute on function public.community_send_message(uuid, text, text, uuid) to authenticated;
grant execute on function public.community_react(uuid, text) to authenticated;
grant execute on function public.community_report(uuid, uuid, text, text) to authenticated;
grant execute on function public.community_ai_allow(text) to authenticated;
grant execute on function public.community_is_member(uuid) to authenticated;
grant execute on function public.community_is_blocked(uuid) to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('community-voice', 'community-voice', false, 5242880,
  array['audio/webm', 'audio/mp4', 'audio/m4a', 'audio/mpeg', 'audio/ogg'])
on conflict (id) do update set
  public = false,
  file_size_limit = 5242880,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Room members read voice notes" on storage.objects;
create policy "Room members read voice notes" on storage.objects
for select to authenticated using (
  bucket_id = 'community-voice'
  and public.community_is_member(split_part(name, '/', 1)::uuid)
  and not public.community_is_blocked(owner_id::uuid)
);
drop policy if exists "Room members upload own voice notes" on storage.objects;
create policy "Room members upload own voice notes" on storage.objects
for insert to authenticated with check (
  bucket_id = 'community-voice'
  and owner_id = (select auth.uid())::text
  and split_part(name, '/', 2) = (select auth.uid())::text
  and public.community_is_member(split_part(name, '/', 1)::uuid)
  and lower(storage.extension(name)) in ('webm', 'm4a', 'mp4', 'ogg')
);
drop policy if exists "Users remove own voice notes" on storage.objects;
create policy "Users remove own voice notes" on storage.objects
for delete to authenticated using (
  bucket_id = 'community-voice'
  and owner_id = (select auth.uid())::text
);

do $$
begin
  alter publication supabase_realtime add table public.community_messages;
exception when duplicate_object then null;
end;
$$;
do $$
begin
  alter publication supabase_realtime add table public.community_room_members;
exception when duplicate_object then null;
end;
$$;
