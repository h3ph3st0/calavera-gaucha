-- Extender tabla universes con campos del catálogo
ALTER TABLE public.universes
  ADD COLUMN IF NOT EXISTS tagline text,
  ADD COLUMN IF NOT EXISTS accent_color text,
  ADD COLUMN IF NOT EXISTS icon text,
  ADD COLUMN IF NOT EXISTS preview_image text,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Extender tabla products con campos del catálogo
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS tagline text,
  ADD COLUMN IF NOT EXISTS size_range text,
  ADD COLUMN IF NOT EXISTS material text,
  ADD COLUMN IF NOT EXISTS is_high_rotation boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS tags text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS image_url text,
  ADD COLUMN IF NOT EXISTS prefill jsonb,
  ADD COLUMN IF NOT EXISTS universe_id uuid REFERENCES public.universes(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS category_slug text,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Índices para lookups frecuentes
CREATE INDEX IF NOT EXISTS idx_products_category_slug ON public.products(category_slug);
CREATE INDEX IF NOT EXISTS idx_products_universe_id   ON public.products(universe_id);
CREATE INDEX IF NOT EXISTS idx_products_high_rotation ON public.products(is_high_rotation) WHERE is_high_rotation = true;

-- Trigger updated_at para universes
CREATE TRIGGER universes_updated_at
  BEFORE UPDATE ON public.universes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Trigger updated_at para products
CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
