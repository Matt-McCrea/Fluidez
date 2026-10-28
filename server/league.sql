/* ============================================================================
 * LA LIGA — the shared half of the weekly Traducción competition.
 *
 * Paste this whole file into the Supabase SQL editor and run it once. The
 * last statement prints the league's join code.
 *
 * Every write goes through a function below; the tables themselves are
 * read-only to the app. That is the whole security model: a player can file
 * their own rounds and votes and nothing else, and the step they play at is
 * set here, never by the client — except the one placement round, once.
 *
 *   join_league(code, name)  first run on a device; anonymous sign-in first
 *   place(step)              the placement round's result, accepted once
 *   submit_round(r)          a finished round (and its "eso también vale"
 *                            claims), idempotent on r.client_id so the
 *                            offline outbox can resend freely
 *   log_session(day, n)      a daily session finished, for Constancia
 *   vote(claim, ok)          👍/👎 on a friend's claimed translation
 *   board(week)              the week's table: best round, step, days
 *   appraise_week(week)      Monday 03:00 UTC, by pg_cron — moves steps
 *
 * Scores are WORDS translated correctly, not sentences: sentences lengthen
 * with the band (3.8 words at A1, 6.2 at C1), so counting sentences would
 * make promotion cost points and reward staying low.
 * ========================================================================== */

create extension if not exists pg_cron;

-- ---- tables ----------------------------------------------------------------

create table public.leagues (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  code       text not null unique,
  tz         text not null default 'Europe/London',   -- where the week ends
  created_at timestamptz not null default now()
);

/* Ten steps, two per band: 1–2 A1, 3–4 A2, 5–6 B1, 7–8 B2, 9–10 C1 — the
 * same rungs js/gamescore.js already climbs. Null until placement. */
create table public.players (
  id         uuid primary key references auth.users on delete cascade,
  league_id  uuid not null references public.leagues on delete cascade,
  name       text not null check (char_length(name) between 1 and 24),
  step       int check (step between 1 and 10),
  bad_weeks  int not null default 0,
  created_at timestamptz not null default now(),
  unique (league_id, name)
);

/* own_* are the sentences at your step, next_* the ones from the step above
 * — the two numbers the weekly appraisal reads. */
create table public.rounds (
  id         bigint generated always as identity primary key,
  player_id  uuid not null references public.players on delete cascade,
  client_id  text not null,
  week       date not null,
  step       int not null,
  played_at  timestamptz not null,
  words      int not null check (words between 0 and 400),
  own_seen   int not null default 0 check (own_seen between 0 and 200),
  own_right  int not null default 0 check (own_right between 0 and own_seen),
  next_seen  int not null default 0 check (next_seen between 0 and 200),
  next_right int not null default 0 check (next_right between 0 and next_seen),
  ms         int,
  curve      jsonb,
  unique (player_id, client_id)
);
create index on public.rounds (week, player_id);

/* An answer the game marked wrong and the player said was right. Its words
 * count while pending or approved; one 👎 from a friend takes them back. */
create table public.claims (
  id         bigint generated always as identity primary key,
  round_id   bigint not null references public.rounds on delete cascade,
  player_id  uuid not null references public.players on delete cascade,
  en         text not null check (char_length(en) <= 300),
  es         text not null check (char_length(es) <= 300),
  words      int not null check (words between 1 and 40),
  is_next    boolean not null default false,
  status     text not null default 'pending' check (status in ('pending', 'ok', 'rejected')),
  created_at timestamptz not null default now()
);
create index on public.claims (round_id);

create table public.votes (
  claim_id bigint references public.claims on delete cascade,
  voter_id uuid references public.players on delete cascade,
  ok       boolean not null,
  primary key (claim_id, voter_id)
);

create table public.sessions (
  player_id uuid references public.players on delete cascade,
  day       date not null,
  reviews   int not null default 0,
  primary key (player_id, day)
);

-- One row per player per appraised week: what the "Tom moved up" pop-up reads.
create table public.appraisals (
  player_id uuid references public.players on delete cascade,
  week      date not null,
  from_step int not null,
  to_step   int not null,
  own_acc   real,
  next_acc  real,
  items     int not null,
  primary key (player_id, week)
);

-- ---- helpers ---------------------------------------------------------------

create function public.my_league() returns uuid
language sql stable security definer set search_path = public as $$
  select league_id from players where id = auth.uid()
$$;

-- The Monday that starts the week `ts` falls in, in the league's time zone.
create function public.week_of(ts timestamptz, tz text) returns date
language sql stable as $$
  select date_trunc('week', ts at time zone tz)::date
$$;

-- ---- reading: league members see each other, nobody else ------------------

alter table public.leagues    enable row level security;
alter table public.players    enable row level security;
alter table public.rounds     enable row level security;
alter table public.claims     enable row level security;
alter table public.votes      enable row level security;
alter table public.sessions   enable row level security;
alter table public.appraisals enable row level security;

create policy "own league" on public.leagues for select using (id = public.my_league());
create policy "league" on public.players for select using (league_id = public.my_league());
create policy "league" on public.rounds for select
  using (player_id in (select id from public.players where league_id = public.my_league()));
create policy "league" on public.claims for select
  using (player_id in (select id from public.players where league_id = public.my_league()));
create policy "league" on public.votes for select
  using (voter_id in (select id from public.players where league_id = public.my_league()));
create policy "league" on public.sessions for select
  using (player_id in (select id from public.players where league_id = public.my_league()));
create policy "league" on public.appraisals for select
  using (player_id in (select id from public.players where league_id = public.my_league()));

-- ---- writing ---------------------------------------------------------------

create function public.join_league(p_code text, p_name text) returns uuid
language plpgsql security definer set search_path = public as $$
declare l uuid;
begin
  if auth.uid() is null then raise exception 'not signed in'; end if;
  select id into l from leagues where code = upper(trim(p_code));
  if l is null then raise exception 'no league with that code'; end if;
  insert into players (id, league_id, name) values (auth.uid(), l, trim(p_name))
  on conflict (id) do update set name = excluded.name;
  return l;
end $$;

-- Once only: after this the step belongs to appraise_week.
create function public.place(p_step int) returns int
language plpgsql security definer set search_path = public as $$
declare s int;
begin
  update players set step = greatest(1, least(10, p_step))
   where id = auth.uid() and step is null
  returning step into s;
  if s is null then select step into s from players where id = auth.uid(); end if;
  return s;
end $$;

/* r = { client_id, played_at, words, own_seen, own_right, next_seen,
 *       next_right, ms, curve: [[ms, words], …],
 *       claims: [{ en, es, words, is_next }, …] }
 * A round played offline counts for the week it was PLAYED in, so long as it
 * arrives within eight days. */
create function public.submit_round(r jsonb) returns bigint
language plpgsql security definer set search_path = public as $$
declare
  p   players;
  tz  text;
  t   timestamptz;
  rid bigint;
  c   jsonb;
begin
  select * into p from players where id = auth.uid();
  if p.id is null then raise exception 'join a league first'; end if;
  if p.step is null then raise exception 'play the placement round first'; end if;
  if coalesce(r->>'client_id', '') = '' then raise exception 'client_id missing'; end if;
  select l.tz into tz from leagues l where l.id = p.league_id;

  -- A resend from the outbox: already filed, and the first copy stands.
  select id into rid from rounds where player_id = p.id and client_id = r->>'client_id';
  if rid is not null then return rid; end if;

  t := least(now(), greatest(now() - interval '8 days',
             coalesce((r->>'played_at')::timestamptz, now())));

  insert into rounds (player_id, client_id, week, step, played_at, words,
                      own_seen, own_right, next_seen, next_right, ms, curve)
  values (p.id, r->>'client_id', week_of(t, tz), p.step, t,
          (r->>'words')::int,
          coalesce((r->>'own_seen')::int, 0),  coalesce((r->>'own_right')::int, 0),
          coalesce((r->>'next_seen')::int, 0), coalesce((r->>'next_right')::int, 0),
          (r->>'ms')::int,
          case when jsonb_typeof(r->'curve') = 'array'
                and jsonb_array_length(r->'curve') <= 40 then r->'curve' end)
  on conflict (player_id, client_id) do nothing
  returning id into rid;

  if rid is null then        -- two resends racing each other
    select id into rid from rounds where player_id = p.id and client_id = r->>'client_id';
    return rid;
  end if;

  if jsonb_typeof(r->'claims') = 'array' then
    for c in select value from jsonb_array_elements(r->'claims') limit 20 loop
      insert into claims (round_id, player_id, en, es, words, is_next)
      values (rid, p.id, c->>'en', c->>'es', (c->>'words')::int,
              coalesce((c->>'is_next')::boolean, false));
    end loop;
  end if;
  return rid;
end $$;

create function public.log_session(p_day date, p_reviews int) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from players where id = auth.uid()) then
    raise exception 'join a league first';
  end if;
  if p_day > current_date + 1 or p_day < current_date - 8 then return; end if;
  insert into sessions (player_id, day, reviews)
  values (auth.uid(), p_day, greatest(0, least(2000, coalesce(p_reviews, 0))))
  on conflict (player_id, day) do update
    set reviews = greatest(sessions.reviews, excluded.reviews);
end $$;

/* One 👎 rejects; approval needs every other member's 👍. With three
 * friends that is two votes, and nobody votes on their own claim. */
create function public.vote(p_claim bigint, p_ok boolean) returns text
language plpgsql security definer set search_path = public as $$
declare
  cl     claims;
  lg     uuid;
  others int;
  n_yes  int;
  n_no   int;
  st     text;
begin
  select * into cl from claims where id = p_claim;
  if cl.id is null or cl.player_id = auth.uid() then raise exception 'cannot vote on this'; end if;
  select league_id into lg from players where id = cl.player_id;
  if lg is distinct from my_league() then raise exception 'not your league'; end if;

  insert into votes (claim_id, voter_id, ok) values (p_claim, auth.uid(), p_ok)
  on conflict (claim_id, voter_id) do update set ok = excluded.ok;

  select count(*) - 1 into others from players where league_id = lg;
  select count(*) filter (where ok), count(*) filter (where not ok)
    into n_yes, n_no from votes where claim_id = p_claim;
  st := case when n_no > 0 then 'rejected' when n_yes >= others then 'ok' else 'pending' end;
  update claims set status = st where id = p_claim;
  return st;
end $$;

-- ---- the table -------------------------------------------------------------

/* Best round of the week per player, with rejected claims taken off it, plus
 * the Constancia numbers. The best round's curve rides along so the leader
 * can be raced as a ghost. */
create function public.board(p_week date default null)
returns table (player_id uuid, name text, step int, best int, round_id bigint,
               curve jsonb, days int, reviews int)
language sql stable security definer set search_path = public as $$
  with me as (
    select p.league_id, coalesce(p_week, week_of(now(), l.tz)) as wk
      from players p join leagues l on l.id = p.league_id
     where p.id = auth.uid()
  ),
  scored as (
    select r.id, r.player_id, r.curve, r.played_at,
           r.words - coalesce((select sum(c.words) from claims c
                                where c.round_id = r.id and c.status = 'rejected'), 0) as score
      from rounds r join players p on p.id = r.player_id, me
     where r.week = me.wk and p.league_id = me.league_id
  ),
  best as (
    select distinct on (s.player_id) s.player_id, s.id, s.score, s.curve
      from scored s order by s.player_id, s.score desc, s.played_at
  )
  select p.id, p.name, p.step, coalesce(b.score, 0)::int, b.id, b.curve,
         (select count(*) from sessions s
           where s.player_id = p.id and s.day >= me.wk and s.day < me.wk + 7)::int,
         (select coalesce(sum(s.reviews), 0) from sessions s
           where s.player_id = p.id and s.day >= me.wk and s.day < me.wk + 7)::int
    from players p cross join me
    left join best b on b.player_id = p.id
   where p.league_id = me.league_id
   order by 4 desc, 7 desc, 2
$$;

-- ---- the weekly appraisal --------------------------------------------------

/* Up a step:  ≥ 30 sentences, ≥ 80% at your own step AND ≥ 60% on at least
 *             six from the step above.
 * Down a step: under 50% at your own step two appraised weeks running — one
 *             bad week never costs anything.
 * A week with no rounds is not appraised and changes nothing.
 * Rejected claims count as wrong; pending ones as right. */
create function public.appraise_week(p_week date default null) returns void
language plpgsql security definer set search_path = public as $$
declare
  p   record;
  wk  date;
  o_s int; o_r int; n_s int; n_r int;
  oa  real; na real;
  ns  int; bad int;
begin
  for p in select pl.*, l.tz from players pl join leagues l on l.id = pl.league_id
            where pl.step is not null loop
    wk := coalesce(p_week, week_of(now(), p.tz) - 7);
    continue when exists (select 1 from appraisals a where a.player_id = p.id and a.week = wk);

    select coalesce(sum(own_seen), 0), coalesce(sum(own_right), 0),
           coalesce(sum(next_seen), 0), coalesce(sum(next_right), 0)
      into o_s, o_r, n_s, n_r
      from rounds where player_id = p.id and week = wk and step = p.step;
    continue when o_s + n_s = 0;

    select o_r - count(*) filter (where not c.is_next), n_r - count(*) filter (where c.is_next)
      into o_r, n_r
      from claims c join rounds r on r.id = c.round_id
     where r.player_id = p.id and r.week = wk and r.step = p.step and c.status = 'rejected';

    oa := case when o_s > 0 then greatest(0, o_r)::real / o_s end;
    na := case when n_s > 0 then greatest(0, n_r)::real / n_s end;
    ns := p.step;
    bad := 0;
    if o_s + n_s >= 30 and oa >= 0.8 and n_s >= 6 and na >= 0.6 then
      ns := least(10, p.step + 1);
    elsif o_s >= 10 and oa < 0.5 then
      bad := p.bad_weeks + 1;
      if bad >= 2 then ns := greatest(1, p.step - 1); bad := 0; end if;
    end if;

    update players set step = ns, bad_weeks = bad where id = p.id;
    insert into appraisals (player_id, week, from_step, to_step, own_acc, next_acc, items)
    values (p.id, wk, p.step, ns, oa, na, o_s + n_s);
  end loop;
end $$;

-- Only the scheduler may move steps.
revoke execute on function public.appraise_week(date) from public, anon, authenticated;
revoke execute on function public.week_of(timestamptz, text) from anon;

select cron.schedule('fluidez-weekly-appraisal', '0 3 * * 1', 'select public.appraise_week()');

-- ---- the league ------------------------------------------------------------
-- The code is what your friends type to join. It is the only secret: keep it
-- out of the repo.
insert into public.leagues (name, code)
values ('La Liga', upper(substr(md5(random()::text), 1, 6)))
returning name, code;
