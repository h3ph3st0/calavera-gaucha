"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/catalogo", label: "Catálogo" },
  { href: "/universos", label: "Universos" },
  { href: "/presupuesto", label: "Presupuesto" },
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
