-- ============================================================
-- STORAGE: RLS para el bucket "quote-files"
-- ============================================================
-- PASO PREVIO (hacerlo en el Dashboard de Supabase):
--   Storage > New bucket > Name: "quote-files" > Private (desmarcá "Public bucket")
--
-- Este script solo configura las políticas. El bucket ya debe existir.
-- ============================================================

-- Acceso de lectura para admin autenticado (panel de leads)
create policy "admin_select_quote_files_storage"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'quote-files');

-- Acceso de borrado para admin autenticado
create policy "admin_delete_quote_files_storage"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'quote-files');

-- La subida se hace desde el servidor con service role (bypasea RLS).
-- No se necesita política de INSERT para anon.

-- ============================================================
-- QUOTE_FILES TABLE: política de lectura para el panel admin
-- ============================================================
-- El service role bypasea RLS automáticamente, pero si en el futuro
-- se necesita leer quote_files desde el cliente con el rol authenticated:
create policy "admin_select_quote_files_table"
  on public.quote_files for select
  to authenticated
  using (true);
