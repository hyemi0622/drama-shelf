-- ─────────────────────────────────────────────────────────────
--  드라마 기록 · Supabase 설정 SQL
--  Supabase 대시보드 → SQL Editor → New query 에 전체 붙여넣고 Run
-- ─────────────────────────────────────────────────────────────

-- 1) 드라마 테이블
create table if not exists public.dramas (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null default auth.uid() references auth.users(id) on delete cascade,
  region        text not null check (region in ('cn','jp','kr')),
  title         text not null,
  original_title text,
  poster_path   text,                       -- storage 안의 파일 경로
  status        text not null default 'watching'
                check (status in ('watching','done','wish','dropped')),
  current_ep    int  default 0,
  total_ep      int,
  synopsis      text,
  review        text,
  rating        numeric(2,1) check (rating is null or (rating >= 0 and rating <= 5)),
  tags          text[] default '{}',
  quotes        jsonb  default '[]',        -- [{ "text": "...", "note": "..." }]
  start_date    date,
  end_date      date,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

create index if not exists dramas_user_region_idx on public.dramas(user_id, region);

-- updated_at 자동 갱신
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists dramas_set_updated_at on public.dramas;
create trigger dramas_set_updated_at
  before update on public.dramas
  for each row execute function public.set_updated_at();

-- 2) RLS: 로그인한 본인 데이터만 읽고 쓸 수 있음
alter table public.dramas enable row level security;

drop policy if exists "owner can do everything" on public.dramas;
create policy "owner can do everything"
  on public.dramas
  for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 3) 포스터 스토리지 버킷 (공개 읽기, 로그인한 사람만 쓰기)
insert into storage.buckets (id, name, public)
values ('posters', 'posters', true)
on conflict (id) do nothing;

drop policy if exists "posters public read"   on storage.objects;
drop policy if exists "posters auth insert"   on storage.objects;
drop policy if exists "posters auth update"   on storage.objects;
drop policy if exists "posters auth delete"   on storage.objects;

create policy "posters public read"
  on storage.objects for select
  using (bucket_id = 'posters');

create policy "posters auth insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'posters');

create policy "posters auth update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'posters');

create policy "posters auth delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'posters');
