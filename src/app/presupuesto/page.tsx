import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { QuoteForm } from "@/components/quote/QuoteForm";

export const metadata: Metadata = {
  title: "Presupuesto",
  description: "Pedí tu presupuesto de impresión 3D. Respondemos en menos de 24 horas por WhatsApp.",
};

interface Props {
  searchParams: Promise<{
    desc?: string;
    categoria?: string;
    tam?: string;
    mat?: string;
  }>;
}

export default async function PresupuestoPage({ searchParams }: Props) {
  const params = await searchParams;

  const prefill = {
    description: params.desc ? decodeURIComponent(params.desc) : undefined,
    category: params.categoria,
    size: params.tam,
    material: params.mat,
  };

  const fromProduct = Boolean(prefill.description);

  return (
    <>
      <Header />
      <main className="flex-1 bg-base px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-lg">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-primary sm:text-3xl">
              {fromProduct ? "Pedí presupuesto" : "Pedí tu presupuesto"}
            </h1>
            <p className="mt-2 text-secondary">
              {fromProduct
                ? "Ya cargamos los datos del producto. Completá los pasos para recibir el precio por WhatsApp."
                : "Completá el formulario y te respondemos por WhatsApp en menos de 24 horas."}
            </p>
          </div>
          <QuoteForm prefill={prefill} />
        </div>
      </main>
      <Footer />
    </>
  );
}
