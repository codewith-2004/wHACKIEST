
-- Create Quests Table
create table public.quests (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  description text,
  type text check (type in ('discovery', 'challenge', 'photo', 'social')),
  rarity text check (rarity in ('common', 'rare', 'epic', 'mythic')),
  xp integer default 0,
  duration_days integer,
  badge text,
  requirements jsonb, -- Flexible structure for specific completion logic
  stamps jsonb -- To store stamp rewards e.g., {"common": 1}
);

-- Create Sites Table
create table public.sites (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  category text check (category in ('place', 'activity')),
  description text,
  image text,
  distance text, -- e.g "2.5 km"
  xp integer default 50,
  lat double precision,
  lng double precision
);

-- Enable Row Level Security (RLS)
alter table public.quests enable row level security;
alter table public.sites enable row level security;

-- Create Policies (Public Read, Admin Write)
-- Note: For simplicity in this hackathon context, we will allow public insert/update if they have the key, 
-- but in production you'd check for auth.uid()

create policy "Enable read access for all users" on public.quests for select using (true);
create policy "Enable read access for all users" on public.sites for select using (true);

-- Allow anyone with the Anon key to insert/update for the Admin Panel to work easily without specific Auth setup yet.
-- Ideally, you'd restrict this to authenticated users.
create policy "Enable write access for all users" on public.quests for insert with check (true);
create policy "Enable update access for all users" on public.quests for update using (true);
create policy "Enable delete access for all users" on public.quests for delete using (true);

create policy "Enable write access for all users" on public.sites for insert with check (true);
create policy "Enable update access for all users" on public.sites for update using (true);
create policy "Enable delete access for all users" on public.sites for delete using (true);
