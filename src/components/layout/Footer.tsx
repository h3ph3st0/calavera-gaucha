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
          <nav className="flex items-center gap-4 text-sm text-muted">
            <Link href="/catalogo" className="transition-colors hover:text-secondary">Catálogo</Link>
            <Link href="/universos" className="transition-colors hover:text-secondary">Universos</Link>
            <Link href="/presupuesto" className="transition-colors hover:text-secondary">Presupuesto</Link>
            <Link href="/para-tu-negocio" className="transition-colors hover:text-secondary">Para tu negocio</Link>
            <a
              href="https://wa.me/5493454045104"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-secondary"
              aria-label="WhatsApp"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.554 4.118 1.528 5.855L.057 23.454a.75.75 0 0 0 .918.975l5.86-1.536A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.89 0-3.66-.52-5.17-1.427l-.37-.22-3.48.913.929-3.38-.242-.382A9.944 9.944 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
              </svg>
            </a>
            <a
              href="https://www.instagram.com/calaveragaucha?igsh=MTEydHJtMWpzeHBraQ=="
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-secondary"
              aria-label="Instagram"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
              </svg>
            </a>
          </nav>
        </div>
        <div className="mt-6 flex flex-col items-center gap-2 border-t border-white/8 pt-6 text-center text-xs text-muted sm:flex-row sm:justify-between sm:text-left">
          <p>© {new Date().getFullYear()} Calavera Gaucha · Concordia, Entre Ríos</p>
          <p>
            Diseñado y desarrollado por{" "}
            <a
              href="https://tbgh.com.ar"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-secondary transition-colors hover:text-bronze"
            >
              TBGH
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
