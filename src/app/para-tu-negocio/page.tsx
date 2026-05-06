"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Globe, MessageCircle, Shield, Star } from "lucide-react";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

const FEATURES = [
  {
    icon: Globe,
    title: "Web profesional personalizada",
    desc: "Diseñada con tu identidad, colores, fotos y productos. Lista para recibir clientes desde el día uno.",
  },
  {
    icon: MessageCircle,
    title: "Integración con tus redes y contacto",
    desc: "WhatsApp, Instagram, Facebook y email conectados. Tus clientes te contactan con un clic.",
  },
  {
    icon: Shield,
    title: "Configuración de seguridad inicial",
    desc: "Setup de Cloudflare, certificado SSL y hardening básico incluidos. Tu web, protegida desde el arranque.",
  },
  {
    icon: Star,
    title: "Soporte post-lanzamiento",
    desc: "Acompañamiento en los primeros días. Coordinamos por WhatsApp y resolvemos lo que surja.",
  },
];

export default function ParaTuNegocioPage() {
  const [form, setForm] = useState({
    nombre: "", negocio: "", rubro: "", whatsapp: "", email: "", redes: "", mensaje: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/saas-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setStatus(res.ok ? "ok" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      <Header />
      <main className="flex-1">

        {/* Hero */}
        <section className="bg-base px-4 py-16 text-center sm:px-6 sm:py-24">
          <div className="mx-auto max-w-3xl">
            <span className="inline-block rounded-full border border-bronze/30 bg-bronze/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-bronze">
              Para tu negocio
            </span>
            <h1 className="mt-6 text-3xl font-extrabold uppercase tracking-tight text-primary sm:text-5xl">
              ¿Querés una web<br className="hidden sm:block" /> como esta?
            </h1>
            <p className="mt-6 text-lg text-secondary">
              Creamos la web de tu negocio con diseño profesional, integración con tus redes sociales y configuración de seguridad incluida. Vos te enfocás en vender — nosotros en que te encuentren.
            </p>
            <a
              href="#formulario"
              className="mt-8 inline-block rounded-xl bg-cta px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-cta/20 transition-colors hover:bg-cta-dark"
            >
              Quiero mi web →
            </a>
          </div>
        </section>

        {/* Features */}
        <section className="bg-layer px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-12 text-center text-2xl font-bold text-primary">
              ¿Qué incluye?
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {FEATURES.map((f) => (
                <div key={f.title} className="rounded-xl border border-white/8 bg-card p-6">
                  <f.icon className="mb-3 h-6 w-6 text-bronze" />
                  <h3 className="mb-2 font-semibold text-primary">{f.title}</h3>
                  <p className="text-sm text-secondary">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Casos reales */}
        <section className="bg-base px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <div className="mb-10 text-center">
              <span className="inline-block rounded-full border border-bronze/30 bg-bronze/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-bronze">
                Casos reales
              </span>
              <h2 className="mt-4 text-2xl font-bold text-primary sm:text-3xl">
                Webs que ya están operando
              </h2>
              <p className="mt-3 text-sm text-secondary">
                No vendemos promesas. Tocá los links y comprobá lo que hacemos.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <a
                href="https://calaveragaucha.com.ar"
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-2xl border border-white/8 bg-card p-7 transition-colors hover:border-cta/40"
              >
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-cta">
                  E-commerce / SaaS de alta fidelidad
                </p>
                <h3 className="mb-2 text-xl font-bold text-primary">Calavera Gaucha</h3>
                <p className="text-sm leading-relaxed text-secondary">
                  Esta misma web. Catálogo dinámico, panel admin, formulario multi-paso con scoring, integración WhatsApp + email transaccional.
                </p>
                <p className="mt-4 text-xs text-muted transition-colors group-hover:text-bronze">
                  calaveragaucha.com.ar ↗
                </p>
              </a>

              <a
                href="https://www.amatistaconcordia.com.ar"
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-2xl border border-white/8 bg-card p-7 transition-colors hover:border-cta/40"
              >
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-cta">
                  Gestión inteligente / Comercio personalizado
                </p>
                <h3 className="mb-2 text-xl font-bold text-primary">Amatista</h3>
                <p className="text-sm leading-relaxed text-secondary">
                  E-commerce de tazas y regalería personalizadas en Concordia. Catálogo temático, wizard de personalización, integración con redes y WhatsApp.
                </p>
                <p className="mt-4 text-xs text-muted transition-colors group-hover:text-bronze">
                  amatistaconcordia.com.ar ↗
                </p>
              </a>
            </div>

            <p className="mt-8 text-center text-xs text-muted">
              Ambas plataformas fueron desarrolladas por{" "}
              <a
                href="https://tbgh.com.ar"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-bronze transition-colors hover:text-cta"
              >
                TBGH
              </a>
              {" "}— el mismo equipo que construye tu próxima web.
            </p>
          </div>
        </section>

        {/* Social proof */}
        <section className="bg-base px-4 py-12 text-center sm:px-6">
          <div className="mx-auto max-w-2xl">
            <p className="text-sm text-muted">Seguinos para ver el trabajo en vivo</p>
            <div className="mt-4 flex justify-center gap-6">
              <a
                href="https://www.instagram.com/calaveragaucha?igsh=MTEydHJtMWpzeHBraQ=="
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-secondary transition-colors hover:text-primary"
              >
                <InstagramIcon className="h-4 w-4" />
                @calaveragaucha
              </a>
            </div>
          </div>
        </section>

        {/* Formulario */}
        <section id="formulario" className="bg-layer px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-xl">
            <h2 className="mb-2 text-center text-2xl font-bold text-primary">
              Contanos sobre tu negocio
            </h2>
            <p className="mb-8 text-center text-sm text-muted">
              Te respondemos por WhatsApp en menos de 24 horas.
            </p>

            {status === "ok" ? (
              <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-8 text-center">
                <p className="text-lg font-semibold text-green-400">¡Mensaje recibido!</p>
                <p className="mt-2 text-sm text-secondary">Te contactamos en breve por WhatsApp.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-secondary">Tu nombre *</label>
                    <input
                      name="nombre"
                      value={form.nombre}
                      onChange={handleChange}
                      required
                      placeholder="Juan García"
                      className="w-full rounded-lg border border-white/10 bg-card px-4 py-2.5 text-sm text-primary placeholder:text-muted focus:border-bronze/50 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-secondary">Nombre del negocio *</label>
                    <input
                      name="negocio"
                      value={form.negocio}
                      onChange={handleChange}
                      required
                      placeholder="Mi Emprendimiento"
                      className="w-full rounded-lg border border-white/10 bg-card px-4 py-2.5 text-sm text-primary placeholder:text-muted focus:border-bronze/50 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-secondary">Rubro *</label>
                  <input
                    name="rubro"
                    value={form.rubro}
                    onChange={handleChange}
                    required
                    placeholder="Impresión 3D, pastelería, ropa, etc."
                    className="w-full rounded-lg border border-white/10 bg-card px-4 py-2.5 text-sm text-primary placeholder:text-muted focus:border-bronze/50 focus:outline-none"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-secondary">WhatsApp *</label>
                    <input
                      name="whatsapp"
                      value={form.whatsapp}
                      onChange={handleChange}
                      required
                      placeholder="+54 9 ..."
                      className="w-full rounded-lg border border-white/10 bg-card px-4 py-2.5 text-sm text-primary placeholder:text-muted focus:border-bronze/50 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-secondary">Email</label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="opcional"
                      className="w-full rounded-lg border border-white/10 bg-card px-4 py-2.5 text-sm text-primary placeholder:text-muted focus:border-bronze/50 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-secondary">Redes sociales</label>
                  <input
                    name="redes"
                    value={form.redes}
                    onChange={handleChange}
                    placeholder="@miemprendimiento en Instagram, Facebook, etc."
                    className="w-full rounded-lg border border-white/10 bg-card px-4 py-2.5 text-sm text-primary placeholder:text-muted focus:border-bronze/50 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-secondary">¿Qué necesitás? *</label>
                  <textarea
                    name="mensaje"
                    value={form.mensaje}
                    onChange={handleChange}
                    required
                    rows={4}
                    placeholder="Contanos sobre tu negocio, qué productos o servicios ofrecés, y qué esperás de tu web..."
                    className="w-full rounded-lg border border-white/10 bg-card px-4 py-2.5 text-sm text-primary placeholder:text-muted focus:border-bronze/50 focus:outline-none resize-none"
                  />
                </div>

                {status === "error" && (
                  <p className="text-sm text-red-400">Hubo un error al enviar. Intentá de nuevo o escribinos por WhatsApp.</p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full rounded-xl bg-cta py-3 text-sm font-semibold text-white transition-colors hover:bg-cta-dark disabled:opacity-60"
                >
                  {status === "loading" ? "Enviando..." : "Quiero mi web →"}
                </button>
              </form>
            )}
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
