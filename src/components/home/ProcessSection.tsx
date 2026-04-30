import Image from "next/image";

const STEPS = [
  {
    number: "01",
    title: "Impresión en capas",
    description: "Cada pieza se construye capa por capa con precisión de décimas de milímetro en nuestra Ender.",
    image: "/process/impresora-ender.jpg",
    alt: "Pieza siendo impresa en la Ender 3D",
  },
  {
    number: "02",
    title: "Ensamble y detalle",
    description: "Las partes se ensamblan, se lijan y se aplica primer para preparar la superficie antes de pintar.",
    image: "/process/banco-trabajo.jpg",
    alt: "Figuras en proceso de ensamble y pintura en el banco de trabajo",
  },
  {
    number: "03",
    title: "Pintura y acabado",
    description: "Cada figura se pinta a mano con aerógrafo y pincel. El resultado: piezas con nivel de colección.",
    image: "/process/predator-pintura.jpg",
    alt: "Predator siendo pintado con base verde",
  },
];

export function ProcessSection() {
  return (
    <section className="bg-base px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-bronze/30 bg-bronze/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-bronze">
            Detrás de escena
          </span>
          <h2 className="mt-4 text-2xl font-bold text-primary sm:text-3xl">
            Así trabajamos
          </h2>
          <p className="mt-3 max-w-xl mx-auto text-secondary">
            Cada pieza pasa por un proceso artesanal. De la impresora a tus manos con el máximo detalle.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          {STEPS.map((step) => (
            <div key={step.number} className="group flex flex-col gap-4">
              <div className="relative h-56 w-full overflow-hidden rounded-2xl border border-white/8">
                <Image
                  src={step.image}
                  alt={step.alt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute bottom-3 left-4 text-4xl font-black text-white/20 select-none">
                  {step.number}
                </span>
              </div>
              <div>
                <h3 className="font-bold text-primary">{step.title}</h3>
                <p className="mt-1 text-sm text-secondary">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
