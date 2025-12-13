
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
  stamps jsonb, -- To store stamp rewards e.g., {"common": 1}
  lat double precision,
  lng double precision
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

-- Insert Sample Quests
INSERT INTO public.quests (title, description, type, rarity, xp, duration_days, badge, requirements, stamps) VALUES
('First Steps', 'Visit any 3 heritage sites', 'discovery', 'common', 150, NULL, 'Curious Explorer', '{"visit_count": 3}', '{"common": 1}'),
('Temple Seeker', 'Visit all 5 main temples (Virupaksha, Krishna, Pattabhirama, Hemakuta, Achyutaraya)', 'discovery', 'common', 500, 2, 'Temple Master', '{"temples": ["Virupaksha", "Krishna", "Pattabhirama", "Hemakuta", "Achyutaraya"]}', '{"common": 3}'),
('Hidden Gem', 'Visit 3 lesser-known sites (Matanga Hill, Underground Shiva Temple, Harihara Temple)', 'discovery', 'rare', 400, 3, 'Off-Path Explorer', '{"sites": ["Matanga Hill", "Underground Shiva Temple", "Harihara Temple"]}', '{"rare": 2}'),
('Sunrise Ritual', 'Visit Hemakuta Temple at sunrise (6-7 AM) and take a photo', 'photo', 'rare', 350, 1, 'Early Riser', '{"site": "Hemakuta Temple", "time_start": "06:00", "time_end": "07:00", "photo_required": true}', '{"rare": 1}'),
('Sunset Chaser', 'Visit 4 different sites and catch sunset at each', 'discovery', 'epic', 800, 5, 'Golden Hour Master', '{"visit_count": 4, "sunset_required": true}', '{"epic": 1}'),
('Archaeologist''s Route', 'Visit 8 specific sites in a specific order (creating a self-guided tour)', 'discovery', 'epic', 1200, 7, 'Archaeologist', '{"ordered_sites": ["site1", "site2", "site3", "site4", "site5", "site6", "site7", "site8"]}', '{"epic": 2}'),
('Moonlight Wanderer', 'Visit 5 sites and complete at least 1 site visit between 9 PM - 5 AM', 'discovery', 'mythic', 2000, NULL, 'Nocturnal Explorer', '{"visit_count": 5, "night_visit": true}', '{"mythic": 1}');

-- Insert Sample Sites
INSERT INTO public.sites (name, category, description, image, distance, xp, lat, lng) VALUES
('Virupaksha Temple', 'place', 'Ancient temple dedicated to Lord Shiva', '/images/virupaksha.jpg', '0.5 km', 100, 15.3350, 76.4600),
('Krishna Temple', 'place', 'Beautiful temple with intricate carvings', '/images/krishna.jpg', '1.2 km', 100, 15.3380, 76.4620),
('Pattabhirama Temple', 'place', 'Historic temple with unique architecture', '/images/pattabhirama.jpg', '2.1 km', 100, 15.3400, 76.4650),
('Hemakuta Temple', 'place', 'Group of temples on Hemakuta Hill', '/images/hemakuta.jpg', '1.8 km', 100, 15.3420, 76.4630),
('Achyutaraya Temple', 'place', 'Temple known for its pillars', '/images/achyutaraya.jpg', '1.5 km', 100, 15.3360, 76.4610),
('Matanga Hill', 'place', 'Lesser-known hill with panoramic views', '/images/matanga.jpg', '3.2 km', 150, 15.3500, 76.4700),
('Underground Shiva Temple', 'place', 'Hidden temple beneath the ground', '/images/underground.jpg', '2.8 km', 150, 15.3450, 76.4680),
('Harihara Temple', 'place', 'Temple dedicated to Harihara', '/images/harihara.jpg', '2.5 km', 150, 15.3430, 76.4660);
