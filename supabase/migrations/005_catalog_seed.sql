-- ============================================================
-- Actualizar universos con datos completos del catálogo
-- ============================================================
UPDATE public.universes SET
  description  = v.description,
  tagline      = v.tagline,
  accent_color = v.accent_color,
  icon         = v.icon,
  preview_image = v.preview_image
FROM (VALUES
  ('ciencia-ficcion',
   'Naves, robots y mundos distantes. Diseños con estética retrofuturista y maquinaria espacial, inspirados en la era dorada de la ciencia ficción.',
   'El futuro en tus manos', 'indigo', '🚀', '/works/darth-vader.jpg'),
  ('fantasia-medieval',
   'Dragones articulados, armas en miniatura y criaturas mitológicas. Para quienes viven la aventura dentro y fuera de los tableros.',
   'Épica de otro mundo', 'emerald', '⚔️', '/works/dragon-articulado.jpg'),
  ('retro',
   'Arcades, cassettes y píxeles hechos objeto. Piezas que traen de vuelta la estética de la era más creativa de la cultura popular.',
   'Nostalgia con nueva forma', 'purple', '📼', '/works/vecna-cupula.jpg'),
  ('anime-manga',
   'Torii, katanas, máscaras y figuras inspiradas en la estética del arte japonés contemporáneo. Sin marcas, con toda la esencia.',
   'Cultura oriental en 3D', 'rose', '⛩️', '/works/gogeta-dragon-ball.jpg')
) AS v(slug, description, tagline, accent_color, icon, preview_image)
WHERE public.universes.slug = v.slug;

-- ============================================================
-- Insertar productos (upsert idempotente por tenant+slug)
-- ============================================================
WITH
  t   AS (SELECT id FROM public.tenants  WHERE slug = 'calavera-gaucha'),
  u1  AS (SELECT id FROM public.universes WHERE slug = 'ciencia-ficcion'),
  u2  AS (SELECT id FROM public.universes WHERE slug = 'fantasia-medieval'),
  u3  AS (SELECT id FROM public.universes WHERE slug = 'retro'),
  u4  AS (SELECT id FROM public.universes WHERE slug = 'anime-manga')
INSERT INTO public.products
  (tenant_id, slug, name, tagline, description, category_slug, universe_id,
   base_price, size_range, material, is_high_rotation, tags, image_url, prefill)
VALUES

  -- ── Llaveros ─────────────────────────────────────────────────────────────
  ((SELECT id FROM t), 'llavero-texto', 'Llavero con texto',
   'Tu nombre, apodo o mensaje en 3D',
   'El clásico que nunca falla. Podés poner tu nombre, el de alguien, una frase corta o cualquier texto. Ideal para regalar o como souvenir personalizado.',
   'llavero', NULL, 2500, '4 – 8 cm', 'PLA', true,
   ARRAY['regalo','personalizado','nombre'],
   '/works/llaveros-bulk-cumple.jpg',
   '{"description":"Quiero un llavero con texto personalizado. El texto y fuente lo definimos en el chat.","category":"llavero","size":"pequeño","material":"pla"}'::jsonb),

  ((SELECT id FROM t), 'llavero-figura', 'Llavero figura personalizada',
   'Una mini-figura de lo que más te gusta',
   'Traé tu idea —un animal, un objeto, un símbolo— y lo convertimos en llavero. También podés subir una imagen de referencia.',
   'llavero', NULL, 3200, '4 – 7 cm', 'PLA', true,
   ARRAY['regalo','personalizado','figura'],
   '/works/llavero-stitch.jpg',
   '{"description":"Quiero un llavero con una figura personalizada. Comparto referencia por WhatsApp.","category":"llavero","size":"pequeño","material":"pla"}'::jsonb),

  ((SELECT id FROM t), 'llavero-circular', 'Llavero circular con logo',
   'Tu logo, escudo o símbolo en formato medallón',
   'Formato redondo tipo medallón. Muy pedido para equipos deportivos, empresas y grupos. Se puede hacer en relieve o grabado.',
   'llavero', NULL, 2800, '4 – 6 cm', 'PLA', true,
   ARRAY['logo','equipo','empresa','souvenir'],
   '/works/llavero-spotify.jpg',
   '{"description":"Quiero un llavero circular con un logo o escudo. Comparto la imagen de referencia por WhatsApp.","category":"llavero","size":"pequeño","material":"pla"}'::jsonb),

  -- ── Escritorio ────────────────────────────────────────────────────────────
  ((SELECT id FROM t), 'soporte-celular', 'Soporte de celular para escritorio',
   'El lugar perfecto para tu celular',
   'Soporte compacto para tener el celular a mano mientras trabajás. Compatible con la mayoría de los smartphones. Se puede personalizar con tu nombre.',
   'escritorio', NULL, 3500, '8 – 12 cm', 'PETG', true,
   ARRAY['escritorio','funcional','oficina'],
   NULL,
   '{"description":"Quiero un soporte de celular para escritorio en PETG. Modelo estándar, se puede personalizar.","category":"funcional","size":"mediano","material":"petg"}'::jsonb),

  ((SELECT id FROM t), 'soporte-auriculares', 'Soporte para auriculares',
   'Ordená tu setup, protegé tus auriculares',
   'Soporte de escritorio para auriculares tipo over-ear. Diseño minimalista que se adapta a cualquier setup. Impreso en PETG para mayor durabilidad.',
   'escritorio', NULL, 4200, '15 – 22 cm', 'PETG', true,
   ARRAY['escritorio','gaming','funcional','setup'],
   'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
   '{"description":"Quiero un soporte para auriculares over-ear. Diseño minimalista para escritorio.","category":"funcional","size":"mediano","material":"petg"}'::jsonb),

  ((SELECT id FROM t), 'organizador-cables', 'Clips organizadores de cables',
   'El caos de cables tiene solución',
   'Set de clips para organizar cables en el escritorio o detrás del monitor. Se pueden hacer en diferentes colores. Precio por set de 6 unidades.',
   'escritorio', NULL, 1800, '2 – 4 cm c/u', 'Flexible', true,
   ARRAY['escritorio','cables','organización','set'],
   NULL,
   '{"description":"Quiero clips organizadores de cables, set de 6 unidades en material flexible.","category":"funcional","size":"pequeño","material":"flexible"}'::jsonb),

  -- ── Decoración ───────────────────────────────────────────────────────────
  ((SELECT id FROM t), 'macetero-geometrico', 'Macetero geométrico',
   'Verde y diseño en la misma pieza',
   'Macetero de escritorio con formas geométricas. Ideal para suculentas y cactus pequeños. Disponible en varios modelos y colores de filamento.',
   'decoracion', NULL, 3200, '6 – 10 cm', 'PLA', true,
   ARRAY['decoracion','plantas','escritorio','regalo'],
   'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80',
   '{"description":"Quiero un macetero geométrico para suculentas pequeñas. Estilo minimalista o hexagonal.","category":"decoracion","size":"pequeño","material":"pla"}'::jsonb),

  -- ── Ciencia Ficción ───────────────────────────────────────────────────────
  ((SELECT id FROM t), 'nave-retrofuturista', 'Nave espacial retrofuturista',
   'La estética de la era espacial en miniatura',
   'Figura decorativa de nave espacial con estética retrofuturista años 50-70. Sin referencias a franquicias registradas — diseño original inspirado en la ciencia ficción clásica.',
   'universos', (SELECT id FROM u1), 5500, '8 – 15 cm', 'PLA', false,
   ARRAY['espacio','sci-fi','decoracion','coleccion'],
   NULL,
   '{"description":"Quiero una nave espacial retrofuturista decorativa, estética años 50-70, diseño original (sin franquicias).","category":"figura","size":"mediano","material":"pla"}'::jsonb),

  ((SELECT id FROM t), 'robot-mini', 'Robot mini articulado',
   'Pequeño, retro y con mucha personalidad',
   'Robot de mesa estilo retrofuturista con articulaciones funcionales. Diseño original inspirado en los robots de ciencia ficción clásica. Perfecto para el escritorio o una vitrina.',
   'universos', (SELECT id FROM u1), 6000, '10 – 14 cm', 'PLA', false,
   ARRAY['robot','sci-fi','articulado','coleccion'],
   NULL,
   '{"description":"Quiero un robot mini articulado de escritorio, estética retrofuturista, diseño original.","category":"figura","size":"mediano","material":"pla"}'::jsonb),

  -- ── Fantasía & Medieval ───────────────────────────────────────────────────
  ((SELECT id FROM t), 'dragon-articulado', 'Dragón articulado',
   'Flexi-print: se mueve, no se rompe',
   'Dragón impreso en una sola pieza con técnica flexi-print — todas las articulaciones se mueven. Diseño original de fantasía. Uno de los productos más pedidos del catálogo.',
   'universos', (SELECT id FROM u2), 7500, '15 – 25 cm', 'Flexible', false,
   ARRAY['dragon','articulado','flexi','fantasia','regalo'],
   '/works/dragon-articulado.jpg',
   '{"description":"Quiero un dragón articulado (flexi-print), diseño original de fantasía. Sin referencias a marcas registradas.","category":"figura","size":"mediano","material":"flexible"}'::jsonb),

  ((SELECT id FROM t), 'espada-miniatura', 'Espada decorativa en miniatura',
   'Para la pared, la vitrina o el escritorio',
   'Espada estilo medieval o fantástico en miniatura. Puede ir montada en pared o ser usada como adorno. Diseño original, sin referencias a juegos o franquicias específicas.',
   'universos', (SELECT id FROM u2), 4500, '20 – 30 cm', 'PLA', false,
   ARRAY['espada','medieval','fantasia','decoracion','pared'],
   NULL,
   '{"description":"Quiero una espada decorativa en miniatura, estilo medieval/fantástico. Para pared o vitrina.","category":"decoracion","size":"grande","material":"pla"}'::jsonb),

  -- ── Retro 80s/90s ─────────────────────────────────────────────────────────
  ((SELECT id FROM t), 'joystick-decorativo', 'Joystick arcade decorativo',
   'El clásico del arcade, ahora en tu escritorio',
   'Réplica decorativa de joystick estilo arcade clásico. No funcional — es una pieza de colección. Ideal para amantes del gaming retro y la estética pixel.',
   'universos', (SELECT id FROM u3), 5800, '10 – 16 cm', 'PLA', false,
   ARRAY['arcade','gaming','retro','decoracion','coleccion'],
   NULL,
   '{"description":"Quiero un joystick arcade decorativo, estilo clásico 80s, diseño original (sin marcas).","category":"decoracion","size":"mediano","material":"pla"}'::jsonb),

  ((SELECT id FROM t), 'cassette-decorativo', 'Cinta de cassette decorativa',
   'La nostalgia tiene nueva forma',
   'Cinta de cassette a tamaño real o en versión agrandada decorativa. Puede tener texto personalizado en la etiqueta. Perfecta como regalo retro.',
   'universos', (SELECT id FROM u3), 2800, '7 – 14 cm', 'PLA', false,
   ARRAY['cassette','retro','80s','regalo','personalizado'],
   NULL,
   '{"description":"Quiero una cinta de cassette decorativa, con texto personalizable en la etiqueta.","category":"decoracion","size":"pequeño","material":"pla"}'::jsonb),

  -- ── Anime & Manga ─────────────────────────────────────────────────────────
  ((SELECT id FROM t), 'mascara-hannya', 'Máscara Hannya decorativa',
   'Arte tradicional japonés en 3D',
   'Máscara de teatro Noh estilo Hannya para colgar en pared. Diseño artístico inspirado en la tradición japonesa. Sin referencias a series o personajes registrados.',
   'universos', (SELECT id FROM u4), 5200, '12 – 18 cm', 'PLA', false,
   ARRAY['mascara','hannya','japonés','decoracion','pared'],
   NULL,
   '{"description":"Quiero una máscara Hannya decorativa para pared, estilo arte japonés tradicional.","category":"decoracion","size":"mediano","material":"pla"}'::jsonb),

  ((SELECT id FROM t), 'torii-miniatura', 'Torii miniatura',
   'El portal sagrado en tu espacio',
   'Torii (portal japonés) en miniatura para escritorio o jardín interior. Disponible solo o en versión con camino de piedras decorativo. Diseño arquitectónico tradicional.',
   'universos', (SELECT id FROM u4), 3800, '8 – 16 cm', 'PLA', false,
   ARRAY['torii','japonés','decoracion','escritorio','jardin'],
   NULL,
   '{"description":"Quiero un Torii miniatura para escritorio o jardín interior. Estilo arquitectónico japonés tradicional.","category":"decoracion","size":"pequeño","material":"pla"}'::jsonb),

  -- ── Hogar & Organización ──────────────────────────────────────────────────
  ((SELECT id FROM t), 'porta-control', 'Soporte porta control de pared',
   'Nunca más perdés el control remoto',
   'Soporte de pared para uno o dos controles remotos (TV, AC, proyector). Instalación con cinta doble faz o tornillos. Diseño discreto que combina con cualquier pared.',
   'hogar', NULL, 2800, '10 – 16 cm', 'PETG', true,
   ARRAY['hogar','organización','pared','control'],
   'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80',
   '{"description":"Quiero un soporte de pared para controles remotos. PETG, diseño discreto, instalación con cinta o tornillos.","category":"funcional","size":"pequeño","material":"petg"}'::jsonb),

  ((SELECT id FROM t), 'ganchos-entrada', 'Perchero de entrada (set x3)',
   'Un lugar para llaves, bolsos y camperas',
   'Set de 3 ganchos de pared para la entrada del hogar. Aguantan hasta 2 kg cada uno. Disponibles en diferentes formas (recto, curvo, doble). Se instalan con tarugos o cinta.',
   'hogar', NULL, 3500, '6 – 10 cm c/u', 'PETG', true,
   ARRAY['hogar','organización','pared','ganchos','entrada'],
   NULL,
   '{"description":"Quiero un set de 3 ganchos de pared para entrada, en PETG resistente. Para llaves, bolsos y ropa.","category":"funcional","size":"pequeño","material":"petg"}'::jsonb),

  ((SELECT id FROM t), 'dispensador-bolsas', 'Dispensador de bolsas de supermercado',
   'Las bolsas ordenadas, fácil de colgar',
   'Dispensador de pared para almacenar y sacar bolsas de supermercado una a una. Compacto, higiénico y fácil de instalar. Una solución simple que todos terminan queriendo.',
   'hogar', NULL, 2200, '8 – 14 cm', 'PETG', false,
   ARRAY['hogar','cocina','organización','bolsas'],
   NULL,
   '{"description":"Quiero un dispensador de pared para bolsas de supermercado, en PETG.","category":"funcional","size":"pequeño","material":"petg"}'::jsonb),

  ((SELECT id FROM t), 'organizador-bano', 'Organizador modular para baño',
   'Tu baño ordenado sin gastar en muebles',
   'Set modular de piezas para organizar el baño: soporte de jabón, portacepillos, bandeja de ducha. Se puede pedir solo la pieza que necesitás o el set completo.',
   'hogar', NULL, 4000, '8 – 15 cm', 'PETG', false,
   ARRAY['hogar','baño','organización','modular'],
   NULL,
   '{"description":"Quiero un organizador modular para baño en PETG: soporte de jabón, portacepillos o bandeja. Puedo pedir piezas individuales o el set.","category":"funcional","size":"pequeño","material":"petg"}'::jsonb),

  ((SELECT id FROM t), 'soporte-tablet-cocina', 'Soporte de tablet para cocina',
   'Recetas a la vista, manos libres',
   'Soporte ajustable para tablet o celular en la cocina. Se apoya en la mesada o se puede fijar a pared. Ángulo regulable para ver recetas sin tocar la pantalla.',
   'hogar', NULL, 4500, '12 – 18 cm', 'PETG', false,
   ARRAY['hogar','cocina','tablet','funcional'],
   'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
   '{"description":"Quiero un soporte de tablet para cocina en PETG, ajustable, para ver recetas con manos libres.","category":"funcional","size":"mediano","material":"petg"}'::jsonb)

ON CONFLICT (tenant_id, slug) DO UPDATE SET
  name             = EXCLUDED.name,
  tagline          = EXCLUDED.tagline,
  description      = EXCLUDED.description,
  category_slug    = EXCLUDED.category_slug,
  universe_id      = EXCLUDED.universe_id,
  base_price       = EXCLUDED.base_price,
  size_range       = EXCLUDED.size_range,
  material         = EXCLUDED.material,
  is_high_rotation = EXCLUDED.is_high_rotation,
  tags             = EXCLUDED.tags,
  image_url        = EXCLUDED.image_url,
  prefill          = EXCLUDED.prefill;
