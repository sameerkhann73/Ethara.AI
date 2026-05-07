-- USERS (Managed by Supabase Auth, but we can extend public.users if needed, 
-- usually best to use a trigger to sync auth.users to public.users or just query auth.users via admin)
-- For this simple app, we'll assume we just use the ID from auth.users and store profile data in public.users if needed.
-- Let's create a public.users table to store profile info like name/avatar.

create table public.users (
  id uuid references auth.users not null primary key,
  email text,
  name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security for Users
alter table public.users enable row level security;
create policy "Public profiles are viewable by everyone." on public.users for select using (true);
create policy "Users can insert their own profile." on public.users for insert with check (auth.uid() = id);
create policy "Users can update own profile." on public.users for update using (auth.uid() = id);

-- TASKS
create type task_priority as enum ('LOW', 'MEDIUM', 'HIGH', 'URGENT');
create type task_status as enum ('TODO', 'IN_PROGRESS', 'REVIEW', 'COMPLETED');

create table public.tasks (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  due_date timestamp with time zone,
  priority task_priority default 'MEDIUM',
  status task_status default 'TODO',
  
  creator_id uuid references public.users(id) not null,
  assigned_to_id uuid references public.users(id),
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Tasks
alter table public.tasks enable row level security;
-- View: users can see tasks they created OR are assigned to OR are in a project they are members of.
create policy "Users can view assigned or created tasks" on public.tasks for select
  using (
    auth.uid() = creator_id or 
    auth.uid() = assigned_to_id or
    (project_id is not null and exists (select 1 from public.project_members pm where pm.project_id = tasks.project_id and pm.user_id = auth.uid()))
  );

-- Insert: users can create tasks.
create policy "Users can create tasks" on public.tasks for insert
  with check (auth.uid() = creator_id);

-- Update: creator can update anything; assignee can update status/priority (simplified for now to allow full update if assigned)
create policy "Users can update assigned or created tasks" on public.tasks for update
  using (auth.uid() = creator_id or auth.uid() = assigned_to_id);

-- Delete: only creator can delete
create policy "Creator can delete tasks" on public.tasks for delete
  using (auth.uid() = creator_id);


-- NOTIFICATIONS
create table public.notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) not null,
  message text not null,
  read boolean default false,
  type text, -- e.g. 'TASK_ASSIGNED'
  resource_id uuid, -- link to task id
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.notifications enable row level security;
create policy "Users can view own notifications" on public.notifications for select using (auth.uid() = user_id);
create policy "Users can update own notifications" on public.notifications for update using (auth.uid() = user_id);

-- USER SYNC TRIGGER (CRITICAL for Foreign Key Constraints)
-- This automatically creates a public.users entry when a new user signs up via Supabase Auth.

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, name, avatar_url)
  values (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger definition
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- BACKFILL EXISTING USERS (Run this manually if you already have users signed up)
insert into public.users (id, email)
select id, email from auth.users
on conflict (id) do nothing;

-- PROJECTS
create table public.projects (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  created_by uuid references public.users(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create type project_role as enum ('ADMIN', 'MEMBER');

create table public.project_members (
  project_id uuid references public.projects(id) on delete cascade not null,
  user_id uuid references public.users(id) on delete cascade not null,
  role project_role default 'MEMBER',
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (project_id, user_id)
);

-- Alter Tasks to add project_id
alter table public.tasks add column project_id uuid references public.projects(id) on delete cascade;

-- RLS for Projects
alter table public.projects enable row level security;
create policy "Users can view projects they are members of" on public.projects for select
  using (exists (select 1 from public.project_members where project_members.project_id = public.projects.id and project_members.user_id = auth.uid()));

create policy "Users can create projects" on public.projects for insert
  with check (auth.uid() = created_by);

-- RLS for Project Members
alter table public.project_members enable row level security;
create policy "Members can view project members" on public.project_members for select
  using (exists (select 1 from public.project_members pm where pm.project_id = public.project_members.project_id and pm.user_id = auth.uid()));

create policy "Only ADMIN can insert project members" on public.project_members for insert
  with check (exists (select 1 from public.project_members pm where pm.project_id = project_id and pm.user_id = auth.uid() and pm.role = 'ADMIN'));

create policy "Only ADMIN can delete project members" on public.project_members for delete
  using (exists (select 1 from public.project_members pm where pm.project_id = project_id and pm.user_id = auth.uid() and pm.role = 'ADMIN'));
