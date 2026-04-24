"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

      if (authError) {
        setError("Email o contraseña incorrectos.");
        return;
      }

      router.push("/admin/leads");
      router.refresh();
    } catch {
      setError("Error de conexión. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-secondary">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@ejemplo.com"
          suppressHydrationWarning
          className="w-full rounded-xl border border-white/12 bg-base px-4 py-3 text-primary placeholder:text-muted focus:border-bronze focus:outline-none focus:ring-2 focus:ring-bronze/10"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-secondary">Contraseña</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          suppressHydrationWarning
          className="w-full rounded-xl border border-white/12 bg-base px-4 py-3 text-primary placeholder:text-muted focus:border-bronze focus:outline-none focus:ring-2 focus:ring-bronze/10"
        />
      </div>

      {error && (
        <p className="rounded-xl border border-danger/20 bg-danger/10 px-4 py-2 text-sm text-danger">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-cta py-3 text-sm font-semibold text-white shadow-sm shadow-cta/20 transition-colors hover:bg-cta-dark disabled:opacity-60"
      >
        {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Ingresando...</> : "Ingresar"}
      </button>
    </form>
  );
}
