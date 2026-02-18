-- Create a table for public profiles
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  role text default 'parent',
  email text,
  updated_at timestamp with time zone,
  constraint role_check check (role in ('admin', 'parent'))
);

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;

-- Policies
create policy "Public profiles are viewable by everyone."
  on public.profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on public.profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on public.profiles for update
  using ( auth.uid() = id );

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
declare
  is_admin boolean;
begin
  -- Check if the new user's email matches the admin email
  if new.email = 'erickgonzalezmatarrita@hotmail.com' then
    insert into public.profiles (id, role, email, updated_at)
    values (new.id, 'admin', new.email, now());
  else
    insert into public.profiles (id, role, email, updated_at)
    values (new.id, 'parent', new.email, now());
  end if;
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function every time a user is created
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
