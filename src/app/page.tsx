import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { Features } from "@/components/home/Features";
import { UniversesCTA } from "@/components/home/UniversesCTA";
import { HogarSection } from "@/components/home/HogarSection";
import { InspirationGrid } from "@/components/home/InspirationGrid";
import { WorksGallery } from "@/components/home/WorksGallery";
import { ProcessSection } from "@/components/home/ProcessSection";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <Features />
        <UniversesCTA />
        <HogarSection />
        <InspirationGrid />
        <WorksGallery />
        <ProcessSection />

        {/* CTA final */}
        <section className="bg-layer px-4 py-16 text-center sm:px-6 sm:py-24">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-2xl font-bold text-primary sm:text-3xl">
              ¿Tenés una idea en mente?
            </h2>
            <p className="mt-4 text-secondary">
              Completá el formulario y en menos de 24 horas te respondemos por WhatsApp con el presupuesto.
            </p>
            <Link
              href="/presupuesto"
              className="mt-8 inline-block rounded-xl bg-cta px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-cta/20 transition-colors hover:bg-cta-dark"
            >
              Solicitar presupuesto gratis
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
