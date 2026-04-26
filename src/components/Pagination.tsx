import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  /** Current page (1-indexed) */
  page: number;
  /** Items per page */
  pageSize: number;
  /** Total item count across all pages */
  total: number;
  /** Path to link to (e.g. "/blog", "/admin/posts"). Page is appended as ?page=N */
  basePath: string;
  /** Optional: hide the "X–Y of Z" summary */
  hideSummary?: boolean;
}

/**
 * Reusable pagination control.
 * - Renders Prev / Next chevron buttons + numeric page links.
 * - Collapses to "1 … 4 5 6 … 12" once there are more than ~7 pages.
 * - Returns null if there's only one page (nothing to paginate).
 */
export default function Pagination({
  page,
  pageSize,
  total,
  basePath,
  hideSummary,
}: PaginationProps) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  if (pageCount <= 1) return null;

  const current = Math.min(Math.max(1, page), pageCount);
  const start = (current - 1) * pageSize + 1;
  const end = Math.min(current * pageSize, total);

  const hrefFor = (n: number) => (n === 1 ? basePath : `${basePath}?page=${n}`);

  // Build a compact page list: 1 … (current-1) current (current+1) … last
  const pages: (number | "…")[] = [];
  const push = (v: number | "…") => {
    if (v === "…" && pages[pages.length - 1] === "…") return;
    pages.push(v);
  };

  for (let n = 1; n <= pageCount; n++) {
    if (
      n === 1 ||
      n === pageCount ||
      (n >= current - 1 && n <= current + 1)
    ) {
      push(n);
    } else if (n === 2 || n === pageCount - 1) {
      push("…");
    }
  }

  const navBtn =
    "inline-flex items-center justify-center min-w-9 h-9 px-3 rounded text-sm font-medium border border-gray-300 hover:border-black hover:bg-gray-50 transition-colors";
  const navBtnDisabled =
    "inline-flex items-center justify-center min-w-9 h-9 px-3 rounded text-sm font-medium border border-gray-200 text-gray-400 cursor-not-allowed";
  const numBtn =
    "inline-flex items-center justify-center min-w-9 h-9 px-3 rounded text-sm font-medium border border-gray-300 hover:border-black hover:bg-gray-50 transition-colors";
  const numBtnActive =
    "inline-flex items-center justify-center min-w-9 h-9 px-3 rounded text-sm font-semibold border-2 border-black bg-black text-white";

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-10"
    >
      {!hideSummary && (
        <p className="text-xs text-gray-500">
          Showing <span className="font-semibold text-gray-800">{start}</span>–
          <span className="font-semibold text-gray-800">{end}</span> of{" "}
          <span className="font-semibold text-gray-800">{total}</span>
        </p>
      )}

      <div className="flex items-center gap-2 flex-wrap">
        {current > 1 ? (
          <Link
            href={hrefFor(current - 1)}
            aria-label="Previous page"
            className={navBtn}
          >
            <ChevronLeft size={16} />
          </Link>
        ) : (
          <span aria-hidden="true" className={navBtnDisabled}>
            <ChevronLeft size={16} />
          </span>
        )}

        {pages.map((p, i) =>
          p === "…" ? (
            <span
              key={`gap-${i}`}
              className="text-sm text-gray-400 px-1 select-none"
              aria-hidden="true"
            >
              …
            </span>
          ) : p === current ? (
            <span
              key={p}
              aria-current="page"
              className={numBtnActive}
            >
              {p}
            </span>
          ) : (
            <Link key={p} href={hrefFor(p)} className={numBtn}>
              {p}
            </Link>
          )
        )}

        {current < pageCount ? (
          <Link
            href={hrefFor(current + 1)}
            aria-label="Next page"
            className={navBtn}
          >
            <ChevronRight size={16} />
          </Link>
        ) : (
          <span aria-hidden="true" className={navBtnDisabled}>
            <ChevronRight size={16} />
          </span>
        )}
      </div>
    </nav>
  );
}

/**
 * Helper: read & clamp the ?page= query param to a positive integer.
 * Returns 1 for missing/invalid input.
 */
export function parsePageParam(value: string | string[] | undefined): number {
  if (Array.isArray(value)) value = value[0];
  if (!value) return 1;
  const n = parseInt(value, 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}
