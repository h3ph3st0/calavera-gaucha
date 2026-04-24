import Link from "next/link";
import { Printer } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/8 bg-layer">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold text-primary">
            <Printer className="h-4 w-4 text-bronze" />
            <span>Calavera Gaucha</span>
          </Link>
          <p className="text-center text-sm text-muted">
            Impresión 3D bajo demanda · Hecho en Argentina
          </p>
          <nav className="flex gap-4 text-sm text-muted">
            <Link href="/catalogo" className="transition-colors hover:text-secondary">Catálogo</Link>
            <Link href="/universos" className="transition-colors hover:text-secondary">Universos</Link>
            <Link href="/presupuesto" className="transition-colors hover:text-secondary">Presupuesto</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
