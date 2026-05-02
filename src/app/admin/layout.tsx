import Link from "next/link";
import { Printer, Users, ImageIcon, LayoutGrid, Globe } from "lucide-react";
import { LogoutButton } from "@/components/admin/LogoutButton";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-base">
      <header className="border-b border-white/8 bg-layer">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-primary">
              <Printer className="h-4 w-4 text-bronze" />
              Calavera Gaucha
            </Link>
            <nav className="flex items-center gap-1">
              <Link
                href="/admin/leads"
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-secondary transition-colors hover:bg-card hover:text-primary"
              >
                <Users className="h-4 w-4" />
                Leads
              </Link>
              <Link
                href="/admin/works"
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-secondary transition-colors hover:bg-card hover:text-primary"
              >
                <ImageIcon className="h-4 w-4" />
                Trabajos
              </Link>
              <Link
                href="/admin/catalogo"
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-secondary transition-colors hover:bg-card hover:text-primary"
              >
                <LayoutGrid className="h-4 w-4" />
                Catálogo
              </Link>
              <Link
                href="/admin/universos"
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-secondary transition-colors hover:bg-card hover:text-primary"
              >
                <Globe className="h-4 w-4" />
                Universos
              </Link>
            </nav>
          </div>
          <LogoutButton />
        </div>
      </header>

      <main className="flex-1 px-4 py-6 sm:px-6">{children}</main>
    </div>
  );
}
