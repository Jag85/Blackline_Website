import About from "@/components/About";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import NextStepsCTA from "@/components/NextStepsCTA";
import RelatedLinks from "@/components/RelatedLinks";
import JsonLd from "@/components/JsonLd";
import { buildPageMetadata } from "@/lib/pageMetadata";
import { breadcrumbSchema } from "@/lib/schema";
import { BOOKING_URL } from "@/lib/site";
import { LOCATION_LIST } from "@/lib/locations";

export const metadata = buildPageMetadata({
  title: "About Our Founder Strategy Practice",
  description:
    "Meet Blackline Strategy Partners — founder-led business strategy consulting for founders and CEOs. Led by Jarrell Green in Houston, serving clients nationwide.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="pt-28 md:pt-32">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />
      <div className="bg-gray-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <AnimateOnScroll variant="fade-up">
            <p className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-4">
              Who We Are
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-black">
              About Blackline Strategy Partners
            </h1>
          </AnimateOnScroll>
        </div>
      </div>
      <About />

      {/* In-body links to the commercial pages — /about previously had
          zero contextual outbound links (nav/footer only). */}
      <RelatedLinks
        eyebrow="Explore"
        heading="How we work with founders"
        tone="gray"
        links={[
          {
            href: "/services",
            label: "Strategy consulting services",
            description:
              "Strategy Sessions, Growth Roadmaps, monthly advisory, and Fractional CSO engagements.",
          },
          {
            href: "/pricing",
            label: "Strategy consulting pricing",
            description:
              "Transparent flat pricing — sessions from $297, advisory from $1,500/month.",
          },
          {
            href: "/tools",
            label: "Free founder diagnostics",
            description:
              "Diagnose your bottleneck, measure strategic clarity, or find your conversion gap.",
          },
        ]}
      />

      {/* Body links into the location pages. These otherwise only receive
          sitewide header/footer links, which search engines discount. */}
      <RelatedLinks
        eyebrow="Texas Locations"
        heading="Business strategy consulting across Texas"
        links={LOCATION_LIST.map((l) => ({
          href: `/${l.urlSlug}`,
          label: `Business consultant in ${l.city}`,
          description: l.lede.split(". ").slice(0, 1).join(". ") + ".",
        }))}
      />

      <NextStepsCTA
        eyebrow="Get Started"
        heading="Ready to put this into practice?"
        description="See what we offer, explore our pricing, or start with a free diagnostic tool."
        steps={[
          {
            title: "Explore Our Services",
            description:
              "From single strategy sessions to ongoing advisory partnerships.",
            href: "/services",
            cta: "View Services",
            primary: true,
          },
          {
            title: "Try a Free Tool",
            description:
              "Diagnose your bottleneck or measure your clarity in minutes.",
            href: "/tools",
            cta: "Browse Tools",
          },
          {
            title: "Book a Session",
            description:
              "Pick a time on the calendar — we'll discuss your business and the right starting point.",
            href: BOOKING_URL,
            cta: "Book Now",
          },
        ]}
      />
    </div>
  );
}
