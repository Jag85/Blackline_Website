import Link from "next/link";
import { ArrowRight } from "lucide-react";

export interface RelatedLink {
  /** Internal path, e.g. "/services" */
  href: string;
  /** Anchor text — should be descriptive and keyword-bearing, never "click here" */
  label: string;
  /** One-line description shown under the label */
  description: string;
}

interface RelatedLinksProps {
  /** Small uppercase eyebrow above the heading */
  eyebrow?: string;
  heading: string;
  links: RelatedLink[];
  /** Background tone so consecutive sections alternate cleanly */
  tone?: "white" | "gray";
  /** Grid columns at md+. Default 3. */
  columns?: 2 | 3;
}

/**
 * Contextual in-body internal links.
 *
 * Distinct from the header/footer nav: sitewide chrome links are
 * discounted by search engines because they appear on every page.
 * Contextual links inside the main content are what actually
 * distribute PageRank and tell Google which pages are related — so
 * this component exists to give every page real in-body outbound
 * links with descriptive, keyword-bearing anchor text.
 */
export default function RelatedLinks({
  eyebrow,
  heading,
  links,
  tone = "white",
  columns = 3,
}: RelatedLinksProps) {
  if (links.length === 0) return null;

  return (
    <section
      className={`py-16 md:py-20 border-t border-gray-100 ${
        tone === "gray" ? "bg-gray-50" : "bg-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        {eyebrow && (
          <p className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-3">
            {eyebrow}
          </p>
        )}
        <h2 className="text-2xl md:text-3xl font-bold text-black mb-10">
          {heading}
        </h2>
        <div
          className={`grid gap-6 ${
            columns === 2 ? "md:grid-cols-2" : "md:grid-cols-3"
          }`}
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="group block p-6 bg-white border border-gray-200 rounded-lg hover:border-black hover:shadow-md transition-all h-full"
            >
              <p className="text-base font-bold text-black mb-2 inline-flex items-center gap-2">
                {l.label}
                <ArrowRight
                  size={14}
                  className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all"
                />
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                {l.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
