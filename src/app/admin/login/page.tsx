import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/LoginForm";
import { Printer } from "lucide-react";

export const metadata: Metadata = { title: "Admin — Acceso" };

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-base px-4">
      <div className="mb-8 flex items-center gap-2 text-primary">
        <Printer className="h-6 w-6 text-bronze" />
        <span className="text-xl font-bold">Calavera Gaucha</span>
      </div>

      <div className="w-full max-w-sm rounded-2xl border border-white/8 bg-card p-8">
        <h1 className="mb-1 text-lg font-bold text-primary">Panel de administración</h1>
        <p className="mb-6 text-sm text-secondary">Ingresá con tu cuenta de Supabase Auth.</p>
        <LoginForm />
      </div>
    </div>
  );
}
