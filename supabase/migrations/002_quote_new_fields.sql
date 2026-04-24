-- Nuevos campos para calificación de leads
alter table public.quotes
  add column if not exists budget_range text,
  add column if not exists use_type text check (use_type in ('personal', 'business'));
