import { Package, Zap, MessageCircle, Star } from "lucide-react";

const FEATURES = [
  {
    icon: Package,
    title: "Cualquier diseño",
    description: "Subí tu archivo .STL o .OBJ, o pedinos un diseño personalizado.",
  },
  {
    icon: Zap,
    title: "Entrega rápida",
    description: "Tiempos de producción según urgencia. Envíos a todo el país.",
  },
  {
    icon: MessageCircle,
    title: "Asesoramiento por WhatsApp",
    description: "Te guiamos en material, tamaño y acabado para el mejor resultado.",
  },
  {
    icon: Star,
    title: "Calidad garantizada",
    description: "Controlamos cada pieza antes de enviarla. Tu satisfacción es lo primero.",
  },
];

export function Features() {
  return (
    <section className="bg-layer px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-2xl font-bold text-primary sm:text-3xl">
          ¿Por qué elegir Calavera Gaucha?
        </h2>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-white/8 bg-card p-6 transition-colors hover:border-bronze/30"
            >
              <div className="mb-4 inline-flex rounded-xl bg-cta/10 p-3">
                <f.icon className="h-5 w-5 text-cta" />
              </div>
              <h3 className="mb-2 font-semibold text-primary">{f.title}</h3>
              <p className="text-sm leading-relaxed text-secondary">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
