import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { UniverseCard } from "@/components/catalog/UniverseCard";
import { getUniverses, getProductsByUniverse } from "@/lib/supabase/catalog";
import type { UniverseSlug } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Universos",
  description: "Figuras y decoración temática: ciencia ficción, fantasía, retro y anime. Impresión 3D bajo demanda.",
};

export default async function UniversosPage() {
  const universes = await getUniverses();
  const counts = await Promise.all(
    universes.map((u) => getProductsByUniverse(u.slug as UniverseSlug).then((p) => p.length))
  );

  return (
    <>
      <Header />
      <main className="flex-1 bg-base">
        <div className="border-b border-white/8 bg-layer px-4 py-10 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <h1 className="text-2xl font-bold text-primary sm:text-3xl">Universos</h1>
            <p className="mt-2 text-secondary">
              Colecciones temáticas con diseños originales. Sin marcas registradas, con toda la esencia.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="grid gap-6 sm:grid-cols-2">
            {universes.map((universe, i) => (
              <UniverseCard key={universe.slug} universe={universe} productCount={counts[i]} />
            ))}
          </div>

          <div className="mt-16 rounded-2xl border border-white/8 bg-card px-6 py-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-muted">
              ¿Tu universo no está acá?
            </p>
            <h2 className="mt-2 text-xl font-bold text-primary sm:text-2xl">
              Hacemos diseños de cualquier temática
            </h2>
            <p className="mt-3 text-secondary">
              Compartinos una imagen de referencia y lo llevamos al 3D.
            </p>
            <a
              href="/presupuesto"
              className="mt-6 inline-block rounded-xl bg-cta px-8 py-3 text-sm font-bold text-white shadow-sm shadow-cta/20 transition-colors hover:bg-cta-dark"
            >
              Pedir diseño personalizado
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
