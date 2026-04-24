-- Habilitar extensiones necesarias
create extension if not exists "uuid-ossp";

-- ============================================================
-- TENANTS (base para arquitectura multi-tenant futura)
-- ============================================================
create table public.tenants (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text not null,
  plan text not null default 'free',
  settings jsonb default '{}',
  created_at timestamptz not null default now()
);

-- Tenant por defecto para uso actual (single-tenant)
insert into public.tenants (slug, name) values ('calavera-gaucha', 'Calavera Gaucha');

-- ============================================================
-- UNIVERSOS TEMÁTICOS
-- ============================================================
create table public.universes (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null,
  slug text not null,
  description text,
  theme text, -- 'sci-fi' | 'fantasy' | 'retro' | 'anime'
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique(tenant_id, slug)
);

-- ============================================================
-- CATEGORÍAS DE PRODUCTOS
-- ============================================================
create table public.product_categories (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  universe_id uuid references public.universes(id) on delete set null,
  name text not null,
  slug text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique(tenant_id, slug)
);

-- ============================================================
-- PRODUCTOS
-- ============================================================
create table public.products (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  category_id uuid references public.product_categories(id) on delete set null,
  name text not null,
  slug text not null,
  description text,
  base_price numeric(10, 2),
  images text[] default '{}',
  is_active boolean not null default true,
  metadata jsonb default '{}',
  created_at timestamptz not null default now(),
  unique(tenant_id, slug)
);

-- ============================================================
-- PRESUPUESTOS / LEADS
-- ============================================================
create type quote_status as enum ('new', 'contacted', 'converted', 'lost');
create type quote_urgency as enum ('low', 'medium', 'high');

create table public.quotes (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  -- Datos del cliente
  name text not null,
  email text not null,
  phone text,
  whatsapp text,
  -- Datos del pedido
  description text not null,
  size text,
  material text,
  urgency quote_urgency not null default 'medium',
  quantity integer not null default 1,
  -- Gestión interna
  status quote_status not null default 'new',
  lead_score integer not null default 0, -- 0-100
  admin_notes text,
  -- Metadata
  ip_address text,
  user_agent text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Archivos adjuntos al presupuesto
create table public.quote_files (
  id uuid primary key default uuid_generate_v4(),
  quote_id uuid not null references public.quotes(id) on delete cascade,
  storage_path text not null,
  original_name text not null,
  file_type text not null,
  size_bytes bigint not null,
  created_at timestamptz not null default now()
);

-- ============================================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================================
create index idx_quotes_tenant_status on public.quotes(tenant_id, status);
create index idx_quotes_created_at on public.quotes(created_at desc);
create index idx_products_tenant_active on public.products(tenant_id, is_active);
create index idx_products_category on public.products(category_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.tenants enable row level security;
alter table public.universes enable row level security;
alter table public.product_categories enable row level security;
alter table public.products enable row level security;
alter table public.quotes enable row level security;
alter table public.quote_files enable row level security;

-- Productos y universos: lectura pública
create policy "products_public_read" on public.products
  for select using (is_active = true);

create policy "universes_public_read" on public.universes
  for select using (is_active = true);

create policy "categories_public_read" on public.product_categories
  for select using (is_active = true);

-- Quotes: inserción pública (formulario), lectura solo con service role
create policy "quotes_public_insert" on public.quotes
  for insert with check (true);

-- Función para actualizar updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger quotes_updated_at
  before update on public.quotes
  for each row execute function update_updated_at();

-- ============================================================
-- SEED: datos iniciales
-- ============================================================
insert into public.universes (tenant_id, name, slug, description, theme)
select
  t.id,
  u.name,
  u.slug,
  u.description,
  u.theme
from public.tenants t, (values
  ('Ciencia Ficción', 'ciencia-ficcion', 'Naves, robots, mundos distantes', 'sci-fi'),
  ('Fantasía & Medieval', 'fantasia-medieval', 'Dragones, espadas, magia', 'fantasy'),
  ('Retro 80s/90s', 'retro', 'Arcade, cassettes, nostalgia', 'retro'),
  ('Anime & Manga', 'anime-manga', 'Personajes inspirados en el mundo oriental', 'anime')
) as u(name, slug, description, theme)
where t.slug = 'calavera-gaucha';
