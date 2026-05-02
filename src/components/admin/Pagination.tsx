import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  page: number;
  totalPages: number;
  totalCount: number;
  status?: string;
}

function buildUrl(page: number, status?: string): string {
  const params = new URLSearchParams();
  if (page > 1) params.set("page", String(page));
  if (status) params.set("status", status);
  const q = params.toString();
  return `/admin/leads${q ? `?${q}` : ""}`;
}

function getPageRange(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "...")[] = [1];
  if (current > 3) pages.push("...");
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    pages.push(i);
  }
  if (current < total - 2) pages.push("...");
  pages.push(total);
  return pages;
}

export function Pagination({ page, totalPages, totalCount, status }: Props) {
  const hasPrev = page > 1;
  const hasNext = page < totalPages;
  const pages = getPageRange(page, totalPages);

  return (
    <div className="mt-6 flex flex-col items-center gap-3">
      <p className="text-xs text-muted">{totalCount} resultados · página {page} de {totalPages}</p>
      <div className="flex items-center gap-1">
        <Link
          href={buildUrl(page - 1, status)}
          aria-disabled={!hasPrev}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg border text-sm transition-colors",
            hasPrev
              ? "border-white/12 bg-card text-secondary hover:border-bronze/30 hover:text-primary"
              : "pointer-events-none border-white/6 text-muted/30"
          )}
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>

        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`e${i}`} className="px-1 text-sm text-muted">…</span>
          ) : (
            <Link
              key={p}
              href={buildUrl(p, status)}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg border text-sm font-medium transition-colors",
                p === page
                  ? "border-cta bg-cta text-white shadow-sm shadow-cta/20"
                  : "border-white/12 bg-card text-secondary hover:border-bronze/30 hover:text-primary"
              )}
            >
              {p}
            </Link>
          )
        )}

        <Link
          href={buildUrl(page + 1, status)}
          aria-disabled={!hasNext}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg border text-sm transition-colors",
            hasNext
              ? "border-white/12 bg-card text-secondary hover:border-bronze/30 hover:text-primary"
              : "pointer-events-none border-white/6 text-muted/30"
          )}
        >
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
