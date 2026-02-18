-- Progression System Schema (Adelanto Scout)

-- Create 'scouts' table
create table if not exists public.scouts (
  id uuid default gen_random_uuid() primary key,
  nombre_completo text not null,
  fecha_nacimiento date not null,
  seccion text not null, -- Flexible field as per request (Manada, Tropa, etc.)
  parent_id uuid references auth.users(id) default auth.uid() not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create 'adelantos' table (Badges/Achievements Catalog)
create table if not exists public.adelantos (
  id uuid default gen_random_uuid() primary key,
  nombre_adelanto text not null,
  tipo text not null check (tipo in ('Etapa', 'Especialidad', 'Mérito')),
  descripcion text not null,
  imagen_url text,
  created_at timestamp with time zone default now()
);

-- Create 'scout_progreso' table (Pivot Table)
create table if not exists public.scout_progreso (
  id uuid default gen_random_uuid() primary key,
  scout_id uuid references public.scouts(id) on delete cascade not null,
  adelanto_id uuid references public.adelantos(id) on delete cascade not null,
  fecha_obtenido date default current_date not null,
  status text not null check (status in ('En proceso', 'Aprobado')),
  unique(scout_id, adelanto_id) -- Prevent duplicate entries for same badge
);

-- Enable Row Level Security (RLS)
alter table public.scouts enable row level security;
alter table public.adelantos enable row level security;
alter table public.scout_progreso enable row level security;

-- RLS Policies

-- Helper policy for Admins (Full Access)
-- Note: Assuming 'admin' role in public.profiles table as per db_schema.sql

-- 1. Policies for 'scouts' table

-- Admin Policy: Full Access
create policy "Admins can do everything on scouts"
  on public.scouts
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Parent Policy: SELECT own children
create policy "Parents can view their own scouts"
  on public.scouts
  for select
  to authenticated
  using ( parent_id = auth.uid() );

-- Parent Policy: INSERT own children
create policy "Parents can insert their own scouts"
  on public.scouts
  for insert
  to authenticated
  with check ( parent_id = auth.uid() );

-- Parent Policy: UPDATE own children
create policy "Parents can update their own scouts"
  on public.scouts
  for update
  to authenticated
  using ( parent_id = auth.uid() )
  with check ( parent_id = auth.uid() );

-- Parent Policy: DELETE own children
create policy "Parents can delete their own scouts"
  on public.scouts
  for delete
  to authenticated
  using ( parent_id = auth.uid() );


-- 2. Policies for 'adelantos' table

-- Admin Policy: Full Access
create policy "Admins can do everything on adelantos"
  on public.adelantos
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Public/Parent Policy: SELECT (Read-only catalog)
create policy "Adelantos are viewable by everyone"
  on public.adelantos
  for select
  to authenticated
  using ( true );


-- 3. Policies for 'scout_progreso' table

-- Admin Policy: Full Access
create policy "Admins can do everything on scout_progreso"
  on public.scout_progreso
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Parent Policy: SELECT own children's progress
create policy "Parents can view their own children's progress"
  on public.scout_progreso
  for select
  to authenticated
  using (
    exists (
      select 1 from public.scouts
      where id = public.scout_progreso.scout_id
      and parent_id = auth.uid()
    )
  );

-- Parents have NO insert/update/delete permissions on scout_progreso as per requirements.
