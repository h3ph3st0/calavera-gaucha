import Link from "next/link";
import Image from "next/image";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-base px-4 py-24 text-center sm:px-6 sm:py-36">
      {/* Radial glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[500px] w-[700px] rounded-full bg-cta/8 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-3xl">
        {/* Avatar mascota — hover para ver en detalle */}
        <div className="group relative mx-auto mb-8 flex h-40 w-40 cursor-pointer items-center justify-center sm:h-52 sm:w-52">
          <div className="absolute inset-0 rounded-full bg-cta/20 blur-2xl transition-all duration-300 group-hover:bg-cta/35 group-hover:blur-3xl" />
          <div className="absolute inset-0 rounded-full bg-bronze/15 blur-xl transition-all duration-300 group-hover:bg-bronze/25" />
          <Image
            src="/avatar.png"
            alt="Calavera Gaucha mascota"
            width={208}
            height={208}
            className="relative h-full w-full object-contain drop-shadow-[0_0_28px_rgba(230,126,34,0.45)] transition-transform duration-300 ease-out group-hover:scale-[1.7] group-hover:drop-shadow-[0_0_48px_rgba(230,126,34,0.65)]"
            priority
            unoptimized
          />
        </div>

        <h1 className="mt-6 text-4xl font-bold tracking-tight text-primary sm:text-6xl">
          Tu idea,{" "}
          <span className="text-cta">impresa en 3D</span>
        </h1>

        <p className="mt-6 text-lg leading-relaxed text-secondary">
          Llaveros, figuras, objetos funcionales y decoración única.
          Diseños exclusivos o traé tu modelo — te lo hacemos realidad.
        </p>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/presupuesto"
            className="w-full rounded-xl bg-cta px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-cta/20 transition-colors hover:bg-cta-dark sm:w-auto"
          >
            Pedir presupuesto gratis
          </Link>
          <Link
            href="/catalogo"
            className="w-full rounded-xl border border-white/15 bg-transparent px-8 py-3.5 text-base font-semibold text-primary transition-colors hover:border-white/30 hover:bg-white/5 sm:w-auto"
          >
            Ver catálogo
          </Link>
        </div>

        <p className="mt-6 text-sm text-muted">
          Respondemos en menos de 24 horas por WhatsApp
        </p>
      </div>
    </section>
  );
}
