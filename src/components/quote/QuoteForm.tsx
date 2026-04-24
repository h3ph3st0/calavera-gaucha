"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ChevronLeft, ChevronRight, Loader2, Paperclip, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { buildWhatsAppLink, calculateLeadScore } from "@/lib/whatsapp";
import { validateFile, sanitizeFilename, MAX_FILES } from "@/lib/validations/quote";
import { QuoteSuccess } from "./QuoteSuccess";

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
  description: z
    .string()
    .min(10, "Contanos un poco más sobre tu idea (mínimo 10 caracteres)")
    .max(2000)
    .trim(),
  category: z.string().optional(),
  useType: z.enum(["personal", "business"]).optional(),
  size: z.string().optional(),
  material: z.string().optional(),
  quantity: z.number().int().min(1, "Mínimo 1").max(999),
  budgetRange: z.string().optional(),
  urgency: z.enum(["low", "medium", "high"]),
  name: z.string().min(2, "Ingresá tu nombre").max(100).trim(),
  whatsapp: z
    .string()
    .min(6, "Ingresá tu número de WhatsApp")
    .max(20)
    .transform((v) => v.replace(/\D/g, "")),
  email: z
    .string()
    .refine(
      (v) => v === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      "Email inválido"
    )
    .optional(),
});

type FormValues = z.infer<typeof schema>;

const STORAGE_KEY = "cg_quote_v1";

const STEP_FIELDS: Record<number, (keyof FormValues)[]> = {
  1: ["description"],
  2: ["quantity"],
  3: ["urgency"],
  4: ["name", "whatsapp"],
};

// ─── Tipos de archivos ────────────────────────────────────────────────────────

interface AttachedFile {
  file: File;
  safeName: string;
  sizeLabel: string;
  error?: string;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ─── Helpers UI ───────────────────────────────────────────────────────────────

function OptionCard({
  selected, onClick, children, className,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-start gap-3 rounded-xl border-2 px-4 py-3.5 text-left transition-all",
        selected
          ? "border-cta bg-cta/8 text-primary"
          : "border-white/12 bg-base text-secondary hover:border-white/25 hover:text-primary",
        className
      )}
    >
      {children}
    </button>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-sm text-danger">{message}</p>;
}

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="mb-2 block text-sm font-semibold text-primary">
      {children}
      {required && <span className="ml-1 text-danger">*</span>}
    </label>
  );
}

// ─── Paso 1: ¿Qué querés imprimir? ───────────────────────────────────────────

const CATEGORIES = [
  { value: "llavero", label: "🔑 Llavero" },
  { value: "figura", label: "🧩 Figura" },
  { value: "decoracion", label: "🏠 Decoración" },
  { value: "funcional", label: "⚙️ Funcional" },
  { value: "otro", label: "✨ Otro" },
];

function Step1({ form }: { form: ReturnType<typeof useForm<FormValues>> }) {
  const { register, watch, setValue, formState: { errors } } = form;
  const category = watch("category");
  const useType = watch("useType");

  return (
    <div className="space-y-5">
      <div>
        <Label required>¿Qué querés imprimir?</Label>
        <textarea
          {...register("description")}
          rows={4}
          placeholder="Contanos tu idea... Ej: Un llavero con mi apellido y un mate, aprox. 6 cm, para regalar"
          className="w-full resize-none rounded-xl border border-white/12 bg-base px-4 py-3 text-primary placeholder:text-muted focus:border-bronze focus:outline-none focus:ring-2 focus:ring-bronze/10"
        />
        <FieldError message={errors.description?.message} />
      </div>

      <div>
        <Label>Tipo de producto</Label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setValue("category", category === c.value ? "" : c.value)}
              className={cn(
                "rounded-xl border px-3 py-2.5 text-sm font-medium transition-all",
                category === c.value
                  ? "border-bronze bg-bronze/12 text-bronze"
                  : "border-white/12 bg-base text-secondary hover:border-white/25 hover:text-primary"
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label>¿Es para uso personal o para tu negocio?</Label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: "personal" as const, label: "👤 Personal", sub: "regalo, colección, hobby" },
            { value: "business" as const, label: "🏢 Negocio", sub: "stock, venta, empresa" },
          ].map((opt) => (
            <OptionCard
              key={opt.value}
              selected={useType === opt.value}
              onClick={() => setValue("useType", useType === opt.value ? undefined : opt.value)}
            >
              <div>
                <p className="font-semibold">{opt.label}</p>
                <p className="text-xs text-muted">{opt.sub}</p>
              </div>
            </OptionCard>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Paso 2: Tamaño, cantidad, material y presupuesto ─────────────────────────

const SIZES = [
  { value: "pequeño", label: "Pequeño", sub: "hasta 5 cm" },
  { value: "mediano", label: "Mediano", sub: "5 – 15 cm" },
  { value: "grande", label: "Grande", sub: "15 – 30 cm" },
  { value: "no-se", label: "No sé", sub: "me asesorás" },
];

const MATERIALS = [
  { value: "pla", label: "PLA", sub: "colores vivos, uso general" },
  { value: "petg", label: "PETG", sub: "resistente al calor y golpes" },
  { value: "flexible", label: "Flexible", sub: "piezas blandas o gomas" },
  { value: "no-se", label: "Asesorame", sub: "recomendanos el mejor" },
];

const BUDGETS = [
  { value: "sin-indicar", label: "Prefiero no indicar" },
  { value: "hasta-5k", label: "Hasta $5.000" },
  { value: "5k-15k", label: "$5.000 – $15.000" },
  { value: "15k-30k", label: "$15.000 – $30.000" },
  { value: "mas-30k", label: "Más de $30.000" },
];

function Step2({
  form,
  files,
  onFilesChange,
}: {
  form: ReturnType<typeof useForm<FormValues>>;
  files: AttachedFile[];
  onFilesChange: (files: AttachedFile[]) => void;
}) {
  const { watch, setValue, register, formState: { errors } } = form;
  const size = watch("size");
  const material = watch("material");
  const quantity = watch("quantity") ?? 1;
  const budgetRange = watch("budgetRange");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? []);
    const remaining = MAX_FILES - files.filter((f) => !f.error).length;

    const newFiles: AttachedFile[] = selected.slice(0, remaining).map((file) => {
      const result = validateFile(file);
      return {
        file,
        safeName: result.safeName,
        sizeLabel: formatBytes(file.size),
        error: result.error,
      };
    });

    onFilesChange([...files, ...newFiles]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removeFile(index: number) {
    onFilesChange(files.filter((_, i) => i !== index));
  }

  const validCount = files.filter((f) => !f.error).length;

  return (
    <div className="space-y-6">
      <div>
        <Label>Tamaño aproximado</Label>
        <div className="grid grid-cols-2 gap-2">
          {SIZES.map((s) => (
            <OptionCard key={s.value} selected={size === s.value} onClick={() => setValue("size", s.value)}>
              <div>
                <p className="font-medium">{s.label}</p>
                <p className="text-xs text-muted">{s.sub}</p>
              </div>
            </OptionCard>
          ))}
        </div>
      </div>

      <div>
        <Label>Cantidad</Label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setValue("quantity", Math.max(1, quantity - 1))}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/12 bg-base text-lg text-primary transition-colors hover:border-bronze/30"
          >
            −
          </button>
          <input
            type="number"
            {...register("quantity", { valueAsNumber: true })}
            min={1}
            max={999}
            className="w-16 rounded-xl border border-white/12 bg-base py-2 text-center text-primary focus:border-bronze focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setValue("quantity", Math.min(999, quantity + 1))}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/12 bg-base text-lg text-primary transition-colors hover:border-bronze/30"
          >
            +
          </button>
        </div>
        <FieldError message={errors.quantity?.message} />
      </div>

      <div>
        <Label>Material</Label>
        <div className="grid grid-cols-2 gap-2">
          {MATERIALS.map((m) => (
            <OptionCard
              key={m.value}
              selected={material === m.value}
              onClick={() => setValue("material", material === m.value ? "" : m.value)}
            >
              <div>
                <p className="text-sm font-medium">{m.label}</p>
                <p className="text-xs text-muted">{m.sub}</p>
              </div>
            </OptionCard>
          ))}
        </div>
      </div>

      <div>
        <Label>¿Cuánto tenés pensado invertir? (opcional)</Label>
        <p className="mb-2 text-xs text-muted">
          Nos ayuda a ajustarnos a tu presupuesto y ofrecerte la mejor opción.
        </p>
        <div className="space-y-2">
          {BUDGETS.map((b) => (
            <label
              key={b.value}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-all",
                budgetRange === b.value
                  ? "border-bronze bg-bronze/8"
                  : "border-white/12 bg-base hover:border-white/25"
              )}
            >
              <input
                type="radio"
                name="budgetRange"
                value={b.value}
                checked={budgetRange === b.value}
                onChange={() => setValue("budgetRange", b.value)}
                className="accent-cta"
              />
              <span className={cn("text-sm font-medium", budgetRange === b.value ? "text-bronze" : "text-secondary")}>
                {b.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <Label>Archivos adjuntos (opcional)</Label>
        <p className="mb-2 text-xs text-muted">
          .STL, .OBJ, .3MF, imágenes o ZIP — máx. 50 MB por archivo, hasta {MAX_FILES} archivos.
        </p>

        {files.length > 0 && (
          <ul className="mb-3 space-y-2">
            {files.map((f, i) => (
              <li
                key={i}
                className={cn(
                  "flex items-center justify-between rounded-xl border px-3 py-2 text-sm",
                  f.error ? "border-danger/25 bg-danger/8" : "border-white/12 bg-base"
                )}
              >
                <div className="min-w-0">
                  <p className={cn("truncate font-medium", f.error ? "text-danger" : "text-primary")}>
                    {f.safeName}
                  </p>
                  {f.error ? (
                    <p className="text-xs text-danger/80">{f.error}</p>
                  ) : (
                    <p className="text-xs text-muted">{f.sizeLabel}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="ml-2 shrink-0 rounded-lg p-1 text-muted transition-colors hover:text-danger"
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}

        {validCount < MAX_FILES && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".stl,.obj,.3mf,.step,.stp,.png,.jpg,.jpeg,.webp,.zip"
              onChange={handleFileInput}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/15 bg-base px-4 py-3.5 text-sm font-medium text-secondary transition-colors hover:border-bronze/40 hover:text-bronze"
            >
              <Paperclip className="h-4 w-4" />
              {files.length > 0 ? "Agregar más archivos" : "Subir archivo"}
            </label>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Paso 3: Urgencia ─────────────────────────────────────────────────────────

const URGENCY_OPTIONS = [
  { value: "low" as const, icon: "🕐", label: "Sin apuro", sub: "Me tomás el tiempo necesario" },
  { value: "medium" as const, icon: "📅", label: "Tengo una fecha en mente", sub: "Lo coordinamos juntos" },
  { value: "high" as const, icon: "⚡", label: "Es urgente", sub: "Lo necesito lo antes posible" },
];

function Step3({ form }: { form: ReturnType<typeof useForm<FormValues>> }) {
  const { watch, setValue } = form;
  const urgency = watch("urgency");

  return (
    <div className="space-y-3">
      <Label>¿Para cuándo lo necesitás?</Label>
      {URGENCY_OPTIONS.map((opt) => (
        <OptionCard
          key={opt.value}
          selected={urgency === opt.value}
          onClick={() => setValue("urgency", opt.value)}
        >
          <span className="text-2xl">{opt.icon}</span>
          <div>
            <p className="font-semibold text-primary">{opt.label}</p>
            <p className="text-sm text-secondary">{opt.sub}</p>
          </div>
        </OptionCard>
      ))}
    </div>
  );
}

// ─── Paso 4: Contacto ─────────────────────────────────────────────────────────

function Step4({ form }: { form: ReturnType<typeof useForm<FormValues>> }) {
  const { register, formState: { errors } } = form;

  return (
    <div className="space-y-4">
      <div>
        <Label required>Tu número de WhatsApp</Label>
        <input
          {...register("whatsapp")}
          type="tel"
          placeholder="Ej: 11 1234-5678"
          suppressHydrationWarning
          className="w-full rounded-xl border border-white/12 bg-base px-4 py-3 text-primary placeholder:text-muted focus:border-bronze focus:outline-none focus:ring-2 focus:ring-bronze/10"
        />
        <FieldError message={errors.whatsapp?.message} />
      </div>

      <div>
        <Label required>Tu nombre</Label>
        <input
          {...register("name")}
          type="text"
          placeholder="¿Cómo te llamás?"
          className="w-full rounded-xl border border-white/12 bg-base px-4 py-3 text-primary placeholder:text-muted focus:border-bronze focus:outline-none focus:ring-2 focus:ring-bronze/10"
        />
        <FieldError message={errors.name?.message} />
      </div>

      <div>
        <Label>Email (opcional)</Label>
        <input
          {...register("email")}
          type="email"
          placeholder="Para enviarte el presupuesto también por mail"
          suppressHydrationWarning
          className="w-full rounded-xl border border-white/12 bg-base px-4 py-3 text-primary placeholder:text-muted focus:border-bronze focus:outline-none focus:ring-2 focus:ring-bronze/10"
        />
        <FieldError message={errors.email?.message} />
      </div>

      <p className="text-center text-xs text-muted">
        🔒 Tus datos son confidenciales. Solo los usamos para enviarte el presupuesto.
      </p>
    </div>
  );
}

// ─── Progress bar ─────────────────────────────────────────────────────────────

const STEP_LABELS = ["Tu pedido", "Detalles", "Urgencia", "Contacto"];

function ProgressBar({ current }: { current: number }) {
  return (
    <div className="mb-8">
      <div className="flex items-start">
        {STEP_LABELS.map((label, i) => {
          const step = i + 1;
          const done = step < current;
          const active = step === current;
          return (
            <div key={label} className="flex flex-1 flex-col items-center">
              <div className="relative flex w-full items-center">
                {i > 0 && (
                  <div className={cn("h-0.5 flex-1 transition-colors", done || active ? "bg-cta" : "bg-white/12")} />
                )}
                <div className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all",
                  done
                    ? "bg-cta text-white"
                    : active
                    ? "bg-cta text-white ring-4 ring-cta/20"
                    : "bg-white/10 text-muted"
                )}>
                  {done ? "✓" : step}
                </div>
                {i < STEP_LABELS.length - 1 && (
                  <div className={cn("h-0.5 flex-1 transition-colors", done ? "bg-cta" : "bg-white/12")} />
                )}
              </div>
              <span className={cn("mt-1.5 text-center text-xs transition-colors", active ? "font-semibold text-bronze" : "text-muted")}>
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

const TOTAL_STEPS = 4;

interface PrefillValues {
  description?: string;
  category?: string;
  size?: string;
  material?: string;
}

export function QuoteForm({ prefill }: { prefill?: PrefillValues }) {
  const [step, setStep] = useState(1);
  const [files, setFiles] = useState<AttachedFile[]>([]);
  const [result, setResult] = useState<{
    quoteId: string;
    whatsappUrl: string;
    leadScore: number;
  } | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      quantity: 1,
      urgency: "medium",
      description: prefill?.description ?? "",
      category: prefill?.category ?? "",
    },
  });

  const { handleSubmit, trigger, watch, reset, setValue, formState: { isSubmitting } } = form;

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<FormValues>;
        reset({ quantity: 1, urgency: "medium", ...parsed }, { keepDefaultValues: false });
      } else if (prefill) {
        if (prefill.description) setValue("description", prefill.description);
        if (prefill.category) setValue("category", prefill.category);
        if (prefill.size) setValue("size", prefill.size);
        if (prefill.material) setValue("material", prefill.material);
      }
    } catch {}
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const { unsubscribe } = watch((values) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
      } catch {}
    });
    return () => unsubscribe();
  }, [watch]);

  async function advance() {
    const valid = await trigger(STEP_FIELDS[step]);
    if (valid) setStep((s) => s + 1);
  }

  async function onSubmit(data: FormValues) {
    const validFiles = files.filter((f) => !f.error);
    const leadScore = calculateLeadScore({
      whatsapp: data.whatsapp,
      email: data.email,
      urgency: data.urgency,
      quantity: data.quantity,
      useType: data.useType,
      budgetRange: data.budgetRange,
      description: data.description,
      hasFiles: validFiles.length > 0,
      size: data.size,
      material: data.material,
    });

    let quoteId: string;

    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email || undefined,
          whatsapp: data.whatsapp,
          description: data.description,
          size: data.size !== "no-se" ? data.size : undefined,
          material: data.material !== "no-se" ? data.material : undefined,
          urgency: data.urgency,
          quantity: data.quantity,
          budget_range: data.budgetRange,
          use_type: data.useType,
          lead_score: leadScore,
        }),
      });

      const json = await res.json();
      quoteId = json.id ?? crypto.randomUUID();
    } catch {
      quoteId = crypto.randomUUID();
    }

    const whatsappUrl = buildWhatsAppLink({
      id: quoteId,
      name: data.name,
      description: data.description,
      category: data.category,
      size: data.size,
      material: data.material,
      quantity: data.quantity,
      urgency: data.urgency,
      budgetRange: data.budgetRange,
      useType: data.useType,
      hasFiles: validFiles.length > 0,
      fileNames: validFiles.map((f) => f.safeName),
      email: data.email,
      whatsapp: data.whatsapp,
    });

    try { localStorage.removeItem(STORAGE_KEY); } catch {}

    setResult({ quoteId, whatsappUrl, leadScore });
  }

  if (result) {
    return (
      <QuoteSuccess
        quoteId={result.quoteId}
        whatsappUrl={result.whatsappUrl}
        leadScore={result.leadScore}
      />
    );
  }

  return (
    <div className="rounded-2xl border border-white/8 bg-card p-6 sm:p-8">
      <ProgressBar current={step} />

      <form onSubmit={handleSubmit(onSubmit)}>
        {step === 1 && <Step1 form={form} />}
        {step === 2 && <Step2 form={form} files={files} onFilesChange={setFiles} />}
        {step === 3 && <Step3 form={form} />}
        {step === 4 && <Step4 form={form} />}

        <div className={cn("mt-8 flex gap-3", step > 1 ? "justify-between" : "justify-end")}>
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="flex items-center gap-1.5 rounded-xl border border-white/12 bg-base px-5 py-3 text-sm font-medium text-secondary transition-colors hover:border-white/25 hover:text-primary"
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </button>
          )}

          {step < TOTAL_STEPS ? (
            <button
              type="button"
              onClick={advance}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-cta px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-cta/20 transition-colors hover:bg-cta-dark sm:flex-none sm:px-8"
            >
              Continuar
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-cta px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-cta/20 transition-colors hover:bg-cta-dark disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none sm:px-8"
            >
              {isSubmitting ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Enviando...</>
              ) : (
                "Recibir presupuesto por WhatsApp"
              )}
            </button>
          )}
        </div>
      </form>

      <p className="mt-4 text-center text-xs text-muted">
        Tu progreso se guarda automáticamente
      </p>
    </div>
  );
}
