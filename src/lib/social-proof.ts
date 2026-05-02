import type { UniverseSlug } from "@/lib/catalog";

export type WorkCategory = "llavero" | "universos" | "hogar" | "personalizado";

export interface Work {
  id: string;
  title: string;
  category: WorkCategory;
  material: string;
  printTime: string;
  emoji: string;
  gradient: string;
  image?: string;
  universeSlug?: UniverseSlug;
}

export interface InspirationItem {
  id: string;
  title: string;
  description: string;
  emoji: string;
  gradient: string;
  prefillDescription: string;
}

export const WORKS: Work[] = [
  {
    id: "w1",
    title: "Vecna — Stranger Things",
    category: "universos",
    material: "PLA + pintura",
    printTime: "18 hs",
    emoji: "👁️",
    gradient: "from-future/20 to-future/5",
    image: "/works/vecna-cupula.jpg",
    universeSlug: "retro",
  },
  {
    id: "w2",
    title: "Calavera Gaucha — firma del taller",
    category: "universos",
    material: "PLA + pintura",
    printTime: "12 hs",
    emoji: "💀",
    gradient: "from-bronze/20 to-bronze/5",
    image: "/works/calavera-gaucha.jpg",
  },
  {
    id: "w3",
    title: "Lámpara Harry Potter — Reliquias",
    category: "universos",
    material: "PLA",
    printTime: "10 hs",
    emoji: "🪄",
    gradient: "from-potter/20 to-potter/5",
    image: "/works/lampara-harry-potter.jpg",
    universeSlug: "fantasia-medieval",
  },
  {
    id: "w4",
    title: "Predator — figura completa pintada",
    category: "universos",
    material: "PLA + pintura",
    printTime: "24 hs",
    emoji: "👾",
    gradient: "from-future/20 to-future/5",
    image: "/works/predator.jpg",
    universeSlug: "ciencia-ficcion",
  },
  {
    id: "w5",
    title: "Gogeta — Dragon Ball",
    category: "universos",
    material: "PLA plateado",
    printTime: "14 hs",
    emoji: "⚡",
    gradient: "from-anime/20 to-anime/5",
    image: "/works/gogeta-dragon-ball.jpg",
    universeSlug: "anime-manga",
  },
  {
    id: "w6",
    title: "Darth Vader — Star Wars",
    category: "universos",
    material: "PLA negro",
    printTime: "6 hs",
    emoji: "🌑",
    gradient: "from-starwars/20 to-starwars/5",
    image: "/works/darth-vader.jpg",
    universeSlug: "ciencia-ficcion",
  },
  {
    id: "w7",
    title: "Lady Justice — estatuilla dorada",
    category: "universos",
    material: "PLA + dorado",
    printTime: "8 hs",
    emoji: "⚖️",
    gradient: "from-bronze/20 to-bronze/5",
    image: "/works/justicia-dorada.jpg",
    universeSlug: "fantasia-medieval",
  },
  {
    id: "w8",
    title: "Eddie Munson — Stranger Things",
    category: "universos",
    material: "PLA + resina",
    printTime: "10 hs",
    emoji: "🎸",
    gradient: "from-future/20 to-future/5",
    image: "/works/eddie-munson.jpg",
    universeSlug: "retro",
  },
  {
    id: "w9",
    title: "Dispenser de latas — hogar",
    category: "hogar",
    material: "PETG",
    printTime: "5 hs",
    emoji: "🥫",
    gradient: "from-cta/20 to-cta/5",
    image: "/works/dispenser-latas.jpg",
  },
  {
    id: "w10",
    title: "Llavero Spotify personalizado",
    category: "llavero",
    material: "PLA bicolor",
    printTime: "1 h",
    emoji: "🎵",
    gradient: "from-anime/20 to-anime/5",
    image: "/works/llavero-spotify.jpg",
  },
  {
    id: "w11",
    title: "Llavero Stitch — Disney",
    category: "llavero",
    material: "PLA negro",
    printTime: "1.5 hs",
    emoji: "🔑",
    gradient: "from-potter/20 to-potter/5",
    image: "/works/llavero-stitch.jpg",
    universeSlug: "anime-manga",
  },
  {
    id: "w12",
    title: "Llaveros Turbo — cumpleaños",
    category: "llavero",
    material: "PLA",
    printTime: "1 h c/u",
    emoji: "🏎️",
    gradient: "from-cta/20 to-cta/5",
    image: "/works/llaveros-turbo.jpg",
  },
  {
    id: "w13",
    title: "Chopp personalizado — Messi",
    category: "personalizado",
    material: "PLA tricolor",
    printTime: "6 hs",
    emoji: "🍺",
    gradient: "from-starwars/20 to-starwars/5",
    image: "/works/chopp-personalizado.jpg",
  },
  {
    id: "w14",
    title: "Copa Fernetera — Mundial",
    category: "personalizado",
    material: "PLA + pintura",
    printTime: "4 hs",
    emoji: "🏆",
    gradient: "from-bronze/20 to-bronze/5",
    image: "/works/copa-fernetera.jpg",
  },
  {
    id: "w15",
    title: "Centros de mesa — cumpleaños",
    category: "personalizado",
    material: "PLA",
    printTime: "2 hs c/u",
    emoji: "🎂",
    gradient: "from-cta/20 to-cta/5",
    image: "/works/centros-cumpleanos.jpg",
  },
  {
    id: "w16",
    title: "Wolverine — X-Men pintado",
    category: "universos",
    material: "PLA + pintura",
    printTime: "16 hs",
    emoji: "🦾",
    gradient: "from-starwars/20 to-starwars/5",
    image: "/works/wolverine.jpg",
    universeSlug: "fantasia-medieval",
  },
  {
    id: "w17",
    title: "Poppy Playtime — figura articulada",
    category: "universos",
    material: "PLA tricolor",
    printTime: "8 hs",
    emoji: "🧸",
    gradient: "from-future/20 to-future/5",
    image: "/works/poppy-playtime.jpg",
    universeSlug: "retro",
  },
  {
    id: "w18",
    title: "Chainsaw Man — figura + llavero",
    category: "universos",
    material: "PLA + resina + pintura",
    printTime: "12 hs",
    emoji: "⛓️",
    gradient: "from-anime/20 to-anime/5",
    image: "/works/chainsaw-man.jpg",
    universeSlug: "anime-manga",
  },
  {
    id: "w19",
    title: "Chopps Un Poco de Ruido — banda",
    category: "personalizado",
    material: "PLA multicolor",
    printTime: "6 hs c/u",
    emoji: "🎸",
    gradient: "from-cta/20 to-cta/5",
    image: "/works/chops-banda.jpg",
  },
  {
    id: "w20",
    title: "Llaveros bulk — recuerdo cumpleaños",
    category: "llavero",
    material: "PLA bicolor",
    printTime: "1 h c/u",
    emoji: "🎀",
    gradient: "from-potter/20 to-potter/5",
    image: "/works/llaveros-bulk-cumple.jpg",
  },
  {
    id: "w21",
    title: "Skibidi Toilet Man — duo",
    category: "universos",
    material: "PLA + pintura",
    printTime: "4 hs",
    emoji: "📺",
    gradient: "from-future/20 to-future/5",
    image: "/works/skibidi-toilet.jpg",
    universeSlug: "retro",
  },
  {
    id: "w22",
    title: "TIE Fighter — Star Wars",
    category: "universos",
    material: "PLA blanco",
    printTime: "7 hs",
    emoji: "🚀",
    gradient: "from-starwars/20 to-starwars/5",
    image: "/works/repisa-esquinera.jpg",
    universeSlug: "ciencia-ficcion",
  },
  {
    id: "w23",
    title: "Stitch — figura azul",
    category: "universos",
    material: "PLA azul",
    printTime: "5 hs",
    emoji: "💙",
    gradient: "from-anime/20 to-anime/5",
    image: "/works/stitch-figura.jpg",
    universeSlug: "anime-manga",
  },
  {
    id: "w24",
    title: "Dragón articulado — flexi-print",
    category: "universos",
    material: "Flexible negro",
    printTime: "8 hs",
    emoji: "🐉",
    gradient: "from-potter/20 to-potter/5",
    image: "/works/dragon-articulado.jpg",
    universeSlug: "fantasia-medieval",
  },
];

export function getWorksByUniverse(slug: UniverseSlug): Work[] {
  return WORKS.filter((w) => w.universeSlug === slug);
}

export const INSPIRATIONS: InspirationItem[] = [
  {
    id: "i1",
    title: "Mini figura de tu mascota",
    description: "Escaneamos o diseñamos a tu perro, gato o animal favorito en 3D.",
    emoji: "🐕",
    gradient: "from-bronze/15 to-transparent",
    prefillDescription:
      "Quiero una mini figura de mi mascota en impresión 3D. Comparto fotos por WhatsApp para hacer el diseño.",
  },
  {
    id: "i2",
    title: "Soporte a medida para tu setup",
    description: "Para monitor, micrófono, tablet o cualquier dispositivo con tus medidas.",
    emoji: "🖥️",
    gradient: "from-anime/15 to-transparent",
    prefillDescription:
      "Quiero un soporte personalizado para mi setup de escritorio con medidas específicas.",
  },
  {
    id: "i3",
    title: "Regalo de cumpleaños único",
    description: "Un objeto que no existe en ninguna tienda. Con el nombre, frase o forma que elijas.",
    emoji: "🎁",
    gradient: "from-cta/15 to-transparent",
    prefillDescription:
      "Quiero un regalo de cumpleaños personalizado en impresión 3D. Comparto la idea por WhatsApp.",
  },
  {
    id: "i4",
    title: "Pieza de repuesto o adaptador",
    description: "Perillas, tapas, soportes rotos. Si tenés las medidas, lo reemplazamos.",
    emoji: "🔧",
    gradient: "from-future/15 to-transparent",
    prefillDescription:
      "Necesito una pieza de repuesto o adaptador en 3D. Tengo las medidas o puedo mandar la pieza original.",
  },
  {
    id: "i5",
    title: "Decoración para tu cuarto",
    description: "Letras en 3D, figuras de pared, objetos de colección para tu espacio.",
    emoji: "🏠",
    gradient: "from-potter/15 to-transparent",
    prefillDescription:
      "Quiero decoración en 3D para mi habitación: letras, figuras o elementos de pared.",
  },
  {
    id: "i6",
    title: "Accesorios para juego de mesa",
    description: "Fichas, marcadores, torres o piezas personalizadas para tu juego favorito.",
    emoji: "🎲",
    gradient: "from-starwars/15 to-transparent",
    prefillDescription:
      "Quiero accesorios personalizados para juego de mesa: fichas, marcadores o piezas a medida.",
  },
];
