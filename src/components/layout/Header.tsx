"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/catalogo", label: "Catálogo" },
  { href: "/universos", label: "Universos" },
  { href: "/presupuesto", label: "Presupuesto" },
  { href: "/para-tu-negocio", label: "Para tu negocio" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/8 bg-layer/95 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="text-lg font-extrabold uppercase tracking-[0.18em] text-primary transition-opacity hover:opacity-80"
          >
            Calavera Gaucha
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-secondary transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://wa.me/5493454045104"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="text-secondary transition-colors hover:text-primary"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.554 4.118 1.528 5.855L.057 23.454a.75.75 0 0 0 .918.975l5.86-1.536A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.89 0-3.66-.52-5.17-1.427l-.37-.22-3.48.913.929-3.38-.242-.382A9.944 9.944 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
              </svg>
            </a>
            <a
              href="https://www.instagram.com/calaveragaucha?igsh=MTEydHJtMWpzeHBraQ=="
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-secondary transition-colors hover:text-primary"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
              </svg>
            </a>
            <Link
              href="/presupuesto"
              className="rounded-lg bg-cta px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-cta-dark"
            >
              Pedir presupuesto
            </Link>
          </nav>

          <button
            className="rounded-lg p-2 text-secondary hover:bg-card md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Menú"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <div className={cn("md:hidden", open ? "block pb-4" : "hidden")}>
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-secondary hover:bg-card hover:text-primary"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/presupuesto"
              className="mt-2 rounded-lg bg-cta px-3 py-2 text-center text-sm font-semibold text-white hover:bg-cta-dark"
              onClick={() => setOpen(false)}
            >
              Pedir presupuesto
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
