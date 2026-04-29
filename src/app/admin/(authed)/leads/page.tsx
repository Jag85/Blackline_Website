import Link from "next/link";
import { Sparkles, Mail } from "lucide-react";
import { format } from "date-fns";
import { listLeadsPage } from "@/lib/appwrite/leads";
import AdminErrorBanner from "@/components/admin/AdminErrorBanner";
import LeadDeleteButton from "@/components/admin/LeadDeleteButton";
import Pagination, { parsePageParam } from "@/components/Pagination";
import type { LeadSubmission } from "@/lib/appwrite/types";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 25;

/**
 * Tools the diagnostic engine writes leads for. Used both for the
 * filter chips and to render a clean tool label in each row even if
 * an older submission stored a slightly different `toolLabel` string.
 */
const TOOL_FILTERS: { key: string; label: string; href: string }[] = [
  { key: "", label: "All tools", href: "/admin/leads" },
  {
    key: "focus-scorecard",
    label: "FOCUS Scorecard",
    href: "/admin/leads?tool=focus-scorecard",
  },
  {
    key: "clarity-index",
    label: "Clarity Index",
    href: "/admin/leads?tool=clarity-index",
  },
  {
    key: "capital-conversion",
    label: "Capital Conversion",
    href: "/admin/leads?tool=capital-conversion",
  },
];

function safeFormat(dateStr: string | null | undefined, pattern: string): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "—";
  try {
    return format(d, pattern);
  } catch {
    return "—";
  }
}

/** Parse a JSON string field defensively — never throws. */
function parseJSON<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

interface PageProps {
  searchParams: Promise<{ page?: string; tool?: string }>;
}

export default async function AdminLeadsPage({ searchParams }: PageProps) {
  const { page: pageParam, tool: toolParam } = await searchParams;
  const page = parsePageParam(pageParam);
  const toolKey = toolParam?.trim() || undefined;

  let leads: LeadSubmission[] = [];
  let total = 0;
  let error: string | null = null;

  try {
    const result = await listLeadsPage({ page, pageSize: PAGE_SIZE, toolKey });
    leads = Array.isArray(result?.leads) ? result.leads : [];
    total = result?.total ?? 0;
    error = result?.error ?? null;
  } catch (e) {
    error = e instanceof Error ? `${e.name}: ${e.message}` : String(e);
  }

  const completedOnPage = leads.filter((l) => l?.status === "completed").length;
  const basePath = toolKey ? `/admin/leads?tool=${toolKey}` : "/admin/leads";

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-black mb-1">
            Lead Magnet Submissions
          </h1>
          <p className="text-gray-600 text-sm">
            {total} total{toolKey ? ` (filtered)` : ""} ·{" "}
            {completedOnPage} completed on this page
          </p>
        </div>
      </div>

      {/* Tool filter chips — driven from the same list the diagnostic
          engine writes to, so a new tool added later just needs an entry
          in TOOL_FILTERS above. */}
      <div className="flex items-center gap-2 flex-wrap">
        {TOOL_FILTERS.map((f) => {
          const active = (toolKey || "") === f.key;
          return (
            <Link
              key={f.key || "all"}
              href={f.href}
              className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                active
                  ? "bg-black text-white border-black"
                  : "border-gray-300 text-gray-700 hover:border-black"
              }`}
            >
              {f.label}
            </Link>
          );
        })}
      </div>

      {error && <AdminErrorBanner message={error} />}

      {leads.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-16 text-center">
          <Sparkles size={32} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600 mb-2">
            {error
              ? "Could not load leads."
              : toolKey
              ? "No leads for this tool yet."
              : "No lead submissions yet."}
          </p>
          {!error && (
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              Submissions from the FOCUS Scorecard, Founder Clarity Index, and
              Capital Conversion Compass will appear here as soon as a visitor
              fills out the intake form on any of those tools.
            </p>
          )}
        </div>
      ) : (
        <>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Lead
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 w-44 hidden lg:table-cell">
                    Tool
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 w-28">
                    Score
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 w-44 hidden xl:table-cell">
                    Bottleneck
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 w-36 hidden md:table-cell">
                    Submitted
                  </th>
                  <th className="px-6 py-3 w-20"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {leads.map((l) => {
                  const extras = parseJSON<Record<string, string>>(
                    l.extraFields,
                    {}
                  );
                  // Render a couple of the most useful extras inline (revenueBand,
                  // stage, bizType) so the table is informative at a glance.
                  const extrasInline = ["revenueBand", "stage", "bizType"]
                    .map((k) => extras?.[k])
                    .filter(Boolean)
                    .join(" · ");

                  return (
                    <tr
                      key={l.$id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 align-top">
                        <p className="text-sm font-semibold text-black">
                          {l?.firstName || "(no name)"}
                          {l?.businessName ? (
                            <span className="font-normal text-gray-500">
                              {" "}
                              · {l.businessName}
                            </span>
                          ) : null}
                        </p>
                        <a
                          href={`mailto:${l?.email || ""}`}
                          className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-black mt-0.5 break-all"
                        >
                          <Mail size={11} />
                          {l?.email || "(no email)"}
                        </a>
                        {extrasInline && (
                          <p className="text-[11px] text-gray-500 mt-1">
                            {extrasInline}
                          </p>
                        )}
                        {/* Tool label visible on small screens where the
                            dedicated column is hidden. */}
                        <p className="text-[11px] uppercase tracking-wider text-gray-400 mt-1 lg:hidden">
                          {l?.toolLabel || l?.toolKey}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-600 hidden lg:table-cell align-top">
                        {l?.toolLabel || l?.toolKey}
                      </td>
                      <td className="px-6 py-4 align-top">
                        {l?.status === "completed" &&
                        typeof l.overallScore === "number" ? (
                          <span
                            className={`inline-flex items-center text-xs font-bold px-2 py-1 rounded ${
                              l.overallScore >= 70
                                ? "bg-green-100 text-green-800"
                                : l.overallScore >= 40
                                ? "bg-amber-100 text-amber-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {l.overallScore}/100
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded bg-gray-100 text-gray-700">
                            Started
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-700 hidden xl:table-cell align-top">
                        {l?.primaryCategory || "—"}
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500 hidden md:table-cell align-top">
                        {safeFormat(l?.$createdAt, "MMM d, yyyy")}
                        <span className="block text-[10px] text-gray-400 mt-0.5">
                          {safeFormat(l?.$createdAt, "h:mm a")}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right align-top">
                        <LeadDeleteButton id={l.$id} email={l?.email || ""} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <Pagination
            page={page}
            pageSize={PAGE_SIZE}
            total={total}
            basePath={basePath}
          />
        </>
      )}
    </div>
  );
}
