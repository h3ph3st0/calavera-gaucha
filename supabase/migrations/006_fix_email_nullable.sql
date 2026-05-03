-- El email es opcional en el formulario de cotización.
-- El NOT NULL de la migración inicial era incorrecto.
alter table public.quotes
  alter column email drop not null;
