// Catálogo estático — renderizado en build time (sin queries a DB)
// Para pasar a DB: mover a tabla products + admin de catálogo en Fase 5

export type Category = "llavero" | "escritorio" | "decoracion" | "universos" | "hogar";
export type UniverseSlug = "ciencia-ficcion" | "fantasia-medieval" | "retro" | "anime-manga";

export interface Product {
  slug: string;
  name: string;
  tagline: string;           // 1 línea, enfocada en beneficio
  description: string;       // 2-3 oraciones para la página de detalle
  category: Category;
  universeSlug?: UniverseSlug;
  priceFrom?: number;        // en ARS; undefined = "A consultar"
  sizeRange: string;         // ej: "3 – 8 cm"
  material: string;          // material por defecto sugerido
  isHighRotation: boolean;
  tags: string[];
  // Datos para prefill del formulario de presupuesto
  prefill: {
    description: string;     // texto exacto que se carga en el campo descripción
    category: string;        // categoría del form
    size?: string;           // valor del selector de tamaño
    material?: string;       // valor del selector de material
  };
}

export interface Universe {
  slug: UniverseSlug;
  name: string;
  tagline: string;
  description: string;
  theme: string;
  accentColor: string;       // clase Tailwind para el color del universo
  icon: string;              // emoji
}

// ─── Universos ────────────────────────────────────────────────────────────────

export const UNIVERSES: Universe[] = [
  {
    slug: "ciencia-ficcion",
    name: "Ciencia Ficción",
    tagline: "El futuro en tus manos",
    description: "Naves, robots y mundos distantes. Diseños con estética retrofuturista y maquinaria espacial, inspirados en la era dorada de la ciencia ficción.",
    theme: "sci-fi",
    accentColor: "indigo",
    icon: "🚀",
  },
  {
    slug: "fantasia-medieval",
    name: "Fantasía & Medieval",
    tagline: "Épica de otro mundo",
    description: "Dragones articulados, armas en miniatura y criaturas mitológicas. Para quienes viven la aventura dentro y fuera de los tableros.",
    theme: "fantasy",
    accentColor: "emerald",
    icon: "⚔️",
  },
  {
    slug: "retro",
    name: "Retro 80s / 90s",
    tagline: "Nostalgia con nueva forma",
    description: "Arcades, cassettes y píxeles hechos objeto. Piezas que traen de vuelta la estética de la era más creativa de la cultura popular.",
    theme: "retro",
    accentColor: "purple",
    icon: "📼",
  },
  {
    slug: "anime-manga",
    name: "Anime & Manga",
    tagline: "Cultura oriental en 3D",
    description: "Torii, katanas, máscaras y figuras inspiradas en la estética del arte japonés contemporáneo. Sin marcas, con toda la esencia.",
    theme: "anime",
    accentColor: "rose",
    icon: "⛩️",
  },
];

// ─── Productos ────────────────────────────────────────────────────────────────

export const PRODUCTS: Product[] = [
  // Alta rotación — Llaveros
  {
    slug: "llavero-texto",
    name: "Llavero con texto",
    tagline: "Tu nombre, apodo o mensaje en 3D",
    description: "El clásico que nunca falla. Podés poner tu nombre, el de alguien, una frase corta o cualquier texto. Ideal para regalar o como souvenir personalizado.",
    category: "llavero",
    priceFrom: 2500,
    sizeRange: "4 – 8 cm",
    material: "PLA",
    isHighRotation: true,
    tags: ["regalo", "personalizado", "nombre"],
    prefill: {
      description: "Quiero un llavero con texto personalizado. El texto y fuente lo definimos en el chat.",
      category: "llavero",
      size: "pequeño",
      material: "pla",
    },
  },
  {
    slug: "llavero-figura",
    name: "Llavero figura personalizada",
    tagline: "Una mini-figura de lo que más te gusta",
    description: "Traé tu idea —un animal, un objeto, un símbolo— y lo convertimos en llavero. También podés subir una imagen de referencia.",
    category: "llavero",
    priceFrom: 3200,
    sizeRange: "4 – 7 cm",
    material: "PLA",
    isHighRotation: true,
    tags: ["regalo", "personalizado", "figura"],
    prefill: {
      description: "Quiero un llavero con una figura personalizada. Comparto referencia por WhatsApp.",
      category: "llavero",
      size: "pequeño",
      material: "pla",
    },
  },
  {
    slug: "llavero-circular",
    name: "Llavero circular con logo",
    tagline: "Tu logo, escudo o símbolo en formato medallón",
    description: "Formato redondo tipo medallón. Muy pedido para equipos deportivos, empresas y grupos. Se puede hacer en relieve o grabado.",
    category: "llavero",
    priceFrom: 2800,
    sizeRange: "4 – 6 cm",
    material: "PLA",
    isHighRotation: true,
    tags: ["logo", "equipo", "empresa", "souvenir"],
    prefill: {
      description: "Quiero un llavero circular con un logo o escudo. Comparto la imagen de referencia por WhatsApp.",
      category: "llavero",
      size: "pequeño",
      material: "pla",
    },
  },

  // Alta rotación — Escritorio
  {
    slug: "soporte-celular",
    name: "Soporte de celular para escritorio",
    tagline: "El lugar perfecto para tu celular",
    description: "Soporte compacto para tener el celular a mano mientras trabajás. Compatible con la mayoría de los smartphones. Se puede personalizar con tu nombre.",
    category: "escritorio",
    priceFrom: 3500,
    sizeRange: "8 – 12 cm",
    material: "PETG",
    isHighRotation: true,
    tags: ["escritorio", "funcional", "oficina"],
    prefill: {
      description: "Quiero un soporte de celular para escritorio en PETG. Modelo estándar, se puede personalizar.",
      category: "funcional",
      size: "mediano",
      material: "petg",
    },
  },
  {
    slug: "soporte-auriculares",
    name: "Soporte para auriculares",
    tagline: "Ordená tu setup, protegé tus auriculares",
    description: "Soporte de escritorio para auriculares tipo over-ear. Diseño minimalista que se adapta a cualquier setup. Impreso en PETG para mayor durabilidad.",
    category: "escritorio",
    priceFrom: 4200,
    sizeRange: "15 – 22 cm",
    material: "PETG",
    isHighRotation: true,
    tags: ["escritorio", "gaming", "funcional", "setup"],
    prefill: {
      description: "Quiero un soporte para auriculares over-ear. Diseño minimalista para escritorio.",
      category: "funcional",
      size: "mediano",
      material: "petg",
    },
  },
  {
    slug: "organizador-cables",
    name: "Clips organizadores de cables",
    tagline: "El caos de cables tiene solución",
    description: "Set de clips para organizar cables en el escritorio o detrás del monitor. Se pueden hacer en diferentes colores. Precio por set de 6 unidades.",
    category: "escritorio",
    priceFrom: 1800,
    sizeRange: "2 – 4 cm c/u",
    material: "Flexible",
    isHighRotation: true,
    tags: ["escritorio", "cables", "organización", "set"],
    prefill: {
      description: "Quiero clips organizadores de cables, set de 6 unidades en material flexible.",
      category: "funcional",
      size: "pequeño",
      material: "flexible",
    },
  },

  // Alta rotación — Decoración
  {
    slug: "macetero-geometrico",
    name: "Macetero geométrico",
    tagline: "Verde y diseño en la misma pieza",
    description: "Macetero de escritorio con formas geométricas. Ideal para suculentas y cactus pequeños. Disponible en varios modelos y colores de filamento.",
    category: "decoracion",
    priceFrom: 3200,
    sizeRange: "6 – 10 cm",
    material: "PLA",
    isHighRotation: true,
    tags: ["decoracion", "plantas", "escritorio", "regalo"],
    prefill: {
      description: "Quiero un macetero geométrico para suculentas pequeñas. Estilo minimalista o hexagonal.",
      category: "decoracion",
      size: "pequeño",
      material: "pla",
    },
  },

  // Universo — Ciencia Ficción
  {
    slug: "nave-retrofuturista",
    name: "Nave espacial retrofuturista",
    tagline: "La estética de la era espacial en miniatura",
    description: "Figura decorativa de nave espacial con estética retrofuturista años 50-70. Sin referencias a franquicias registradas — diseño original inspirado en la ciencia ficción clásica.",
    category: "universos",
    universeSlug: "ciencia-ficcion",
    priceFrom: 5500,
    sizeRange: "8 – 15 cm",
    material: "PLA",
    isHighRotation: false,
    tags: ["espacio", "sci-fi", "decoracion", "coleccion"],
    prefill: {
      description: "Quiero una nave espacial retrofuturista decorativa, estética años 50-70, diseño original (sin franquicias).",
      category: "figura",
      size: "mediano",
      material: "pla",
    },
  },
  {
    slug: "robot-mini",
    name: "Robot mini articulado",
    tagline: "Pequeño, retro y con mucha personalidad",
    description: "Robot de mesa estilo retrofuturista con articulaciones funcionales. Diseño original inspirado en los robots de ciencia ficción clásica. Perfecto para el escritorio o una vitrina.",
    category: "universos",
    universeSlug: "ciencia-ficcion",
    priceFrom: 6000,
    sizeRange: "10 – 14 cm",
    material: "PLA",
    isHighRotation: false,
    tags: ["robot", "sci-fi", "articulado", "coleccion"],
    prefill: {
      description: "Quiero un robot mini articulado de escritorio, estética retrofuturista, diseño original.",
      category: "figura",
      size: "mediano",
      material: "pla",
    },
  },

  // Universo — Fantasía
  {
    slug: "dragon-articulado",
    name: "Dragón articulado",
    tagline: "Flexi-print: se mueve, no se rompe",
    description: "Dragón impreso en una sola pieza con técnica flexi-print — todas las articulaciones se mueven. Diseño original de fantasía. Uno de los productos más pedidos del catálogo.",
    category: "universos",
    universeSlug: "fantasia-medieval",
    priceFrom: 7500,
    sizeRange: "15 – 25 cm",
    material: "Flexible",
    isHighRotation: false,
    tags: ["dragon", "articulado", "flexi", "fantasia", "regalo"],
    prefill: {
      description: "Quiero un dragón articulado (flexi-print), diseño original de fantasía. Sin referencias a marcas registradas.",
      category: "figura",
      size: "mediano",
      material: "flexible",
    },
  },
  {
    slug: "espada-miniatura",
    name: "Espada decorativa en miniatura",
    tagline: "Para la pared, la vitrina o el escritorio",
    description: "Espada estilo medieval o fantástico en miniatura. Puede ir montada en pared o ser usada como adorno. Diseño original, sin referencias a juegos o franquicias específicas.",
    category: "universos",
    universeSlug: "fantasia-medieval",
    priceFrom: 4500,
    sizeRange: "20 – 30 cm",
    material: "PLA",
    isHighRotation: false,
    tags: ["espada", "medieval", "fantasia", "decoracion", "pared"],
    prefill: {
      description: "Quiero una espada decorativa en miniatura, estilo medieval/fantástico. Para pared o vitrina.",
      category: "decoracion",
      size: "grande",
      material: "pla",
    },
  },

  // Universo — Retro
  {
    slug: "joystick-decorativo",
    name: "Joystick arcade decorativo",
    tagline: "El clásico del arcade, ahora en tu escritorio",
    description: "Réplica decorativa de joystick estilo arcade clásico. No funcional — es una pieza de colección. Ideal para amantes del gaming retro y la estética pixel.",
    category: "universos",
    universeSlug: "retro",
    priceFrom: 5800,
    sizeRange: "10 – 16 cm",
    material: "PLA",
    isHighRotation: false,
    tags: ["arcade", "gaming", "retro", "decoracion", "coleccion"],
    prefill: {
      description: "Quiero un joystick arcade decorativo, estilo clásico 80s, diseño original (sin marcas).",
      category: "decoracion",
      size: "mediano",
      material: "pla",
    },
  },
  {
    slug: "cassette-decorativo",
    name: "Cinta de cassette decorativa",
    tagline: "La nostalgia tiene nueva forma",
    description: "Cinta de cassette a tamaño real o en versión agrandada decorativa. Puede tener texto personalizado en la etiqueta. Perfecta como regalo retro.",
    category: "universos",
    universeSlug: "retro",
    priceFrom: 2800,
    sizeRange: "7 – 14 cm",
    material: "PLA",
    isHighRotation: false,
    tags: ["cassette", "retro", "80s", "regalo", "personalizado"],
    prefill: {
      description: "Quiero una cinta de cassette decorativa, con texto personalizable en la etiqueta.",
      category: "decoracion",
      size: "pequeño",
      material: "pla",
    },
  },

  // Universo — Anime
  {
    slug: "mascara-hannya",
    name: "Máscara Hannya decorativa",
    tagline: "Arte tradicional japonés en 3D",
    description: "Máscara de teatro Noh estilo Hannya para colgar en pared. Diseño artístico inspirado en la tradición japonesa. Sin referencias a series o personajes registrados.",
    category: "universos",
    universeSlug: "anime-manga",
    priceFrom: 5200,
    sizeRange: "12 – 18 cm",
    material: "PLA",
    isHighRotation: false,
    tags: ["mascara", "hannya", "japonés", "decoracion", "pared"],
    prefill: {
      description: "Quiero una máscara Hannya decorativa para pared, estilo arte japonés tradicional.",
      category: "decoracion",
      size: "mediano",
      material: "pla",
    },
  },
  {
    slug: "torii-miniatura",
    name: "Torii miniatura",
    tagline: "El portal sagrado en tu espacio",
    description: "Torii (portal japonés) en miniatura para escritorio o jardín interior. Disponible solo o en versión con camino de piedras decorativo. Diseño arquitectónico tradicional.",
    category: "universos",
    universeSlug: "anime-manga",
    priceFrom: 3800,
    sizeRange: "8 – 16 cm",
    material: "PLA",
    isHighRotation: false,
    tags: ["torii", "japonés", "decoracion", "escritorio", "jardin"],
    prefill: {
      description: "Quiero un Torii miniatura para escritorio o jardín interior. Estilo arquitectónico japonés tradicional.",
      category: "decoracion",
      size: "pequeño",
      material: "pla",
    },
  },

  // Hogar & Organización
  {
    slug: "porta-control",
    name: "Soporte porta control de pared",
    tagline: "Nunca más perdés el control remoto",
    description: "Soporte de pared para uno o dos controles remotos (TV, AC, proyector). Instalación con cinta doble faz o tornillos. Diseño discreto que combina con cualquier pared.",
    category: "hogar",
    priceFrom: 2800,
    sizeRange: "10 – 16 cm",
    material: "PETG",
    isHighRotation: true,
    tags: ["hogar", "organización", "pared", "control"],
    prefill: {
      description: "Quiero un soporte de pared para controles remotos. PETG, diseño discreto, instalación con cinta o tornillos.",
      category: "funcional",
      size: "pequeño",
      material: "petg",
    },
  },
  {
    slug: "ganchos-entrada",
    name: "Perchero de entrada (set x3)",
    tagline: "Un lugar para llaves, bolsos y camperas",
    description: "Set de 3 ganchos de pared para la entrada del hogar. Aguantan hasta 2 kg cada uno. Disponibles en diferentes formas (recto, curvo, doble). Se instalan con tarugos o cinta.",
    category: "hogar",
    priceFrom: 3500,
    sizeRange: "6 – 10 cm c/u",
    material: "PETG",
    isHighRotation: true,
    tags: ["hogar", "organización", "pared", "ganchos", "entrada"],
    prefill: {
      description: "Quiero un set de 3 ganchos de pared para entrada, en PETG resistente. Para llaves, bolsos y ropa.",
      category: "funcional",
      size: "pequeño",
      material: "petg",
    },
  },
  {
    slug: "dispensador-bolsas",
    name: "Dispensador de bolsas de supermercado",
    tagline: "Las bolsas ordenadas, fácil de colgar",
    description: "Dispensador de pared para almacenar y sacar bolsas de supermercado una a una. Compacto, higiénico y fácil de instalar. Una solución simple que todos terminan queriendo.",
    category: "hogar",
    priceFrom: 2200,
    sizeRange: "8 – 14 cm",
    material: "PETG",
    isHighRotation: false,
    tags: ["hogar", "cocina", "organización", "bolsas"],
    prefill: {
      description: "Quiero un dispensador de pared para bolsas de supermercado, en PETG.",
      category: "funcional",
      size: "pequeño",
      material: "petg",
    },
  },
  {
    slug: "organizador-bano",
    name: "Organizador modular para baño",
    tagline: "Tu baño ordenado sin gastar en muebles",
    description: "Set modular de piezas para organizar el baño: soporte de jabón, portacepillos, bandeja de ducha. Se puede pedir solo la pieza que necesitás o el set completo.",
    category: "hogar",
    priceFrom: 4000,
    sizeRange: "8 – 15 cm",
    material: "PETG",
    isHighRotation: false,
    tags: ["hogar", "baño", "organización", "modular"],
    prefill: {
      description: "Quiero un organizador modular para baño en PETG: soporte de jabón, portacepillos o bandeja. Puedo pedir piezas individuales o el set.",
      category: "funcional",
      size: "pequeño",
      material: "petg",
    },
  },
  {
    slug: "soporte-tablet-cocina",
    name: "Soporte de tablet para cocina",
    tagline: "Recetas a la vista, manos libres",
    description: "Soporte ajustable para tablet o celular en la cocina. Se apoya en la mesada o se puede fijar a pared. Ángulo regulable para ver recetas sin tocar la pantalla.",
    category: "hogar",
    priceFrom: 4500,
    sizeRange: "12 – 18 cm",
    material: "PETG",
    isHighRotation: false,
    tags: ["hogar", "cocina", "tablet", "funcional"],
    prefill: {
      description: "Quiero un soporte de tablet para cocina en PETG, ajustable, para ver recetas con manos libres.",
      category: "funcional",
      size: "mediano",
      material: "petg",
    },
  },
];

// ─── Helpers de acceso ────────────────────────────────────────────────────────

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getUniverseBySlug(slug: string): Universe | undefined {
  return UNIVERSES.find((u) => u.slug === slug);
}

export function getProductsByUniverse(universeSlug: UniverseSlug): Product[] {
  return PRODUCTS.filter((p) => p.universeSlug === universeSlug);
}

export function getProductsByCategory(category: Category): Product[] {
  return PRODUCTS.filter((p) => p.category === category);
}

export function getHighRotationProducts(): Product[] {
  return PRODUCTS.filter((p) => p.isHighRotation);
}

export function formatPrice(priceFrom?: number): string {
  if (!priceFrom) return "A consultar";
  const formatted = priceFrom.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `Desde $${formatted}`;
}

export const CATEGORY_LABELS: Record<Category, string> = {
  llavero: "Llaveros",
  escritorio: "Escritorio",
  decoracion: "Decoración",
  universos: "Universos",
  hogar: "Hogar & Organización",
};
