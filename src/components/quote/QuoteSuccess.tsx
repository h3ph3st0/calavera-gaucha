import { CheckCircle, MessageCircle, Clock } from "lucide-react";

interface Props {
  quoteId: string;
  whatsappUrl: string;
  leadScore: number;
}

export function QuoteSuccess({ quoteId, whatsappUrl, leadScore }: Props) {
  const ref = quoteId.slice(0, 8).toUpperCase();

  return (
    <div className="rounded-2xl border border-white/8 bg-card p-8 text-center">
      <div className="mb-4 flex justify-center">
        <div className="rounded-full bg-success/10 p-4">
          <CheckCircle className="h-8 w-8 text-success" />
        </div>
      </div>

      <h2 className="text-xl font-bold text-primary">¡Listo! Tu pedido fue registrado</h2>
      <p className="mt-2 text-sm text-secondary">
        Referencia: <span className="font-mono font-semibold text-primary">#{ref}</span>
      </p>

      <p className="mt-5 text-secondary">
        Hacé click en el botón para abrir WhatsApp. Ya tenemos los datos de tu pedido listos para enviarte el presupuesto.
      </p>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-4 text-base font-semibold text-white shadow transition-opacity hover:opacity-90"
      >
        <MessageCircle className="h-5 w-5" />
        Ir a WhatsApp
      </a>

      <div className="mt-5 flex items-center justify-center gap-2 text-sm text-muted">
        <Clock className="h-4 w-4" />
        <span>Respondemos en menos de 24 horas</span>
      </div>

      {leadScore >= 70 && (
        <p className="mt-4 rounded-xl border border-bronze/20 bg-bronze/8 px-4 py-2 text-xs text-bronze">
          Tu pedido está muy bien detallado — eso nos ayuda a darte un presupuesto más preciso.
        </p>
      )}
    </div>
  );
}
