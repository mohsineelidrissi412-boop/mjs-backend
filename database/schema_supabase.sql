

create extension if not exists "pgcrypto";


-- 1. USERS (membres, encadrants, admins)
create table if not exists public.users (
  id                  bigint generated always as identity primary key,
  email               text unique not null,
  password_hash       text not null,
  first_name          text not null,
  last_name           text not null,
  phone               text,
  birth_date          date,
  role                text not null check (role in ('ADMIN', 'ENCADRANT', 'MEMBER')) default 'MEMBER',
  status              text not null check (status in ('ACTIVE', 'PENDING', 'SUSPENDED')) default 'PENDING',
  profile_picture_url text,
  cv_url              text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

--  ("mot de passe oublié")
create table if not exists public.password_reset_tokens (
  id         bigint generated always as identity primary key,
  user_id    bigint not null references public.users(id) on delete cascade,
  token      text not null unique,
  expires_at timestamptz not null,
  used       boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_password_reset_user_id on public.password_reset_tokens(user_id);

-- 2. PARAMETRES DU SITE 
create table if not exists public.site_settings (
  id         bigint primary key default 1,
  logo_url   text,
  updated_at timestamptz not null default now(),
  constraint site_settings_singleton check (id = 1)
);
insert into public.site_settings (id) values (1) on conflict (id) do nothing;

-- Slider d'images de la page d'accueil
create table if not exists public.site_slider_images (
  id          bigint generated always as identity primary key,
  image_url   text not null,
  order_index integer not null default 0,
  created_at  timestamptz not null default now()
);

-- Contacts : chaque contact = une ligne (telephone, email, adresse, facebook...)
create table if not exists public.contacts (
  id          bigint generated always as identity primary key,
  type        text not null check (type in ('PHONE', 'EMAIL', 'ADDRESS', 'FACEBOOK', 'INSTAGRAM', 'WHATSAPP', 'OTHER')),
  label       text,          
  value       text not null, 
  order_index integer not null default 0,
  created_at  timestamptz not null default now()
);

-- 3. ACTUALITES (news) : titre, texte, images, date de publication
create table if not exists public.news (
  id            bigint generated always as identity primary key,
  title         text not null,
  content       text not null,
  author_id     bigint not null references public.users(id) on delete cascade,
  published_at  timestamptz not null default now(),
  share_count   integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Images multiples par actualite
create table if not exists public.news_images (
  id          bigint generated always as identity primary key,
  news_id     bigint not null references public.news(id) on delete cascade,
  image_url   text not null,
  order_index integer not null default 0
);

-- Commentaires
create table if not exists public.comments (
  id         bigint generated always as identity primary key,
  news_id    bigint not null references public.news(id) on delete cascade,
  author_id  bigint not null references public.users(id) on delete cascade,
  content    text not null,
  created_at timestamptz not null default now()
);

-- Likes 
create table if not exists public.news_likes (
  news_id    bigint not null references public.news(id) on delete cascade,
  user_id    bigint not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (news_id, user_id)
);

-- Partage : compteur simple (incremente cote backend a chaque partage)

create index if not exists idx_news_images_news_id on public.news_images(news_id);
create index if not exists idx_comments_news_id on public.comments(news_id);
create index if not exists idx_news_likes_news_id on public.news_likes(news_id);

-- 4. CLUBS (nom, description, images slider)
create table if not exists public.clubs (
  id          bigint generated always as identity primary key,
  name        text not null unique,
  description text not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Images multiples (slider) par club
create table if not exists public.club_images (
  id          bigint generated always as identity primary key,
  club_id     bigint not null references public.clubs(id) on delete cascade,
  image_url   text not null,
  order_index integer not null default 0
);

-- Relation N-N : encadrants <-> clubs
create table if not exists public.club_encadrants (
  club_id      bigint not null references public.clubs(id) on delete cascade,
  encadrant_id bigint not null references public.users(id) on delete cascade,
  assigned_at  timestamptz not null default now(),
  primary key (club_id, encadrant_id)
);

-- Relation N-N : membres <-> clubs (un membre peut rejoindre plusieurs clubs)
create table if not exists public.club_members (
  club_id   bigint not null references public.clubs(id) on delete cascade,
  member_id bigint not null references public.users(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (club_id, member_id)
);

-- Demandes d'adhesion a un club
create table if not exists public.join_requests (
  id         bigint generated always as identity primary key,
  club_id    bigint not null references public.clubs(id) on delete cascade,
  user_id    bigint not null references public.users(id) on delete cascade,
  status     text not null check (status in ('PENDING', 'APPROVED', 'REJECTED')) default 'PENDING',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists uq_join_requests_pending
  on public.join_requests (club_id, user_id)
  where status = 'PENDING';

create index if not exists idx_club_images_club_id on public.club_images(club_id);

-- 5. EVENEMENTS (titre, description, images, jour, heure)
create table if not exists public.events (
  id          bigint generated always as identity primary key,
  title       text not null,
  description text not null,
  event_date  date not null,
  event_time  time not null,
  club_id     bigint references public.clubs(id) on delete set null,
  creator_id  bigint not null references public.users(id) on delete cascade,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Images multiples par evenement
create table if not exists public.event_images (
  id          bigint generated always as identity primary key,
  event_id    bigint not null references public.events(id) on delete cascade,
  image_url   text not null,
  order_index integer not null default 0
);

create index if not exists idx_events_club_id on public.events(club_id);
create index if not exists idx_event_images_event_id on public.event_images(event_id);

-- 6. PASS JEUNES 
create table if not exists public.pass_jeunes_services (
  id          bigint generated always as identity primary key,
  service_name text not null,
  description  text not null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table if not exists public.pass_jeunes_images (
  id          bigint generated always as identity primary key,
  service_id  bigint not null references public.pass_jeunes_services(id) on delete cascade,
  image_url   text not null,
  order_index integer not null default 0
);

create index if not exists idx_pass_jeunes_images_service_id on public.pass_jeunes_images(service_id);

-- 7. ANNONCES (titre, texte, date de publication)
create table if not exists public.announcements (
  id           bigint generated always as identity primary key,
  title        text not null,
  content      text not null,
  club_id      bigint references public.clubs(id) on delete cascade,
  creator_id   bigint not null references public.users(id) on delete cascade,
  published_at timestamptz not null default now(),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists idx_announcements_club_id on public.announcements(club_id);


create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_users_updated_at before update on public.users
  for each row execute function public.set_updated_at();
create trigger trg_site_settings_updated_at before update on public.site_settings
  for each row execute function public.set_updated_at();
create trigger trg_news_updated_at before update on public.news
  for each row execute function public.set_updated_at();
create trigger trg_clubs_updated_at before update on public.clubs
  for each row execute function public.set_updated_at();
create trigger trg_events_updated_at before update on public.events
  for each row execute function public.set_updated_at();
create trigger trg_pass_jeunes_updated_at before update on public.pass_jeunes_services
  for each row execute function public.set_updated_at();
create trigger trg_announcements_updated_at before update on public.announcements
  for each row execute function public.set_updated_at();
create trigger trg_join_requests_updated_at before update on public.join_requests
  for each row execute function public.set_updated_at();

-- ROW LEVEL SECURITY : activee sur toutes les tables
-- (aucune policy = acces refuse par defaut pour anon/authenticated,
--  seul le backend via service_role/connexion directe peut lire/ecrire)
alter table public.users                  enable row level security;
alter table public.password_reset_tokens  enable row level security;
alter table public.site_settings          enable row level security;
alter table public.site_slider_images     enable row level security;
alter table public.contacts               enable row level security;
alter table public.news                   enable row level security;
alter table public.news_images            enable row level security;
alter table public.comments               enable row level security;
alter table public.news_likes             enable row level security;
alter table public.clubs                  enable row level security;
alter table public.club_images            enable row level security;
alter table public.club_encadrants        enable row level security;
alter table public.club_members           enable row level security;
alter table public.join_requests          enable row level security;
alter table public.events                 enable row level security;
alter table public.event_images           enable row level security;
alter table public.pass_jeunes_services    enable row level security;
alter table public.pass_jeunes_images      enable row level security;
alter table public.announcements          enable row level security;


