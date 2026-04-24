export type WorkCategory = "llavero" | "universos" | "hogar" | "personalizado";

export interface Work {
  id: string;
  title: string;
  category: WorkCategory;
  material: string;
  printTime: string;
  emoji: string;
  gradient: string;
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
    title: "Llavero personalizado con nombre",
    category: "llavero",
    material: "PLA",
    printTime: "1 h",
    emoji: "🔑",
    gradient: "from-bronze/20 to-bronze/5",
  },
  {
    id: "w2",
    title: "Soporte para auriculares gaming",
    category: "hogar",
    material: "PETG",
    printTime: "4 hs",
    emoji: "🎧",
    gradient: "from-anime/20 to-anime/5",
  },
  {
    id: "w3",
    title: "Dragón articulado flexi-print",
    category: "universos",
    material: "Flexible",
    printTime: "8 hs",
    emoji: "🐉",
    gradient: "from-potter/20 to-potter/5",
  },
  {
    id: "w4",
    title: "Set de llaveros corporativos x20",
    category: "llavero",
    material: "PLA",
    printTime: "1.5 hs c/u",
    emoji: "🏷️",
    gradient: "from-cta/20 to-cta/5",
  },
  {
    id: "w5",
    title: "Porta control de pared",
    category: "hogar",
    material: "PETG",
    printTime: "2 hs",
    emoji: "📺",
    gradient: "from-starwars/20 to-starwars/5",
  },
  {
    id: "w6",
    title: "Máscara Hannya decorativa",
    category: "universos",
    material: "PLA",
    printTime: "6 hs",
    emoji: "🎭",
    gradient: "from-anime/20 to-anime/5",
  },
  {
    id: "w7",
    title: "Ganchos de entrada (set x3)",
    category: "hogar",
    material: "PETG",
    printTime: "1.5 hs",
    emoji: "🪝",
    gradient: "from-future/20 to-future/5",
  },
  {
    id: "w8",
    title: "Mini figura personalizada mascota",
    category: "personalizado",
    material: "PLA",
    printTime: "5 hs",
    emoji: "🐕",
    gradient: "from-bronze/20 to-bronze/5",
  },
];

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
