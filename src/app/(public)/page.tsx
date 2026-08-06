import Link from "next/link";
import Hero from "@/components/Hero";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import BestFitClients from "@/components/BestFitClients";
import Testimonials from "@/components/Testimonials";
import BlogTeaser from "@/components/BlogTeaser";
import StatsStrip from "@/components/StatsStrip";
import IndustryMarquee from "@/components/IndustryMarquee";
import RelatedLinks from "@/components/RelatedLinks";
import { LOCATION_LIST } from "@/lib/locations";
import Tilt3D from "@/components/motion/Tilt3D";
import GridBackground from "@/components/motion/GridBackground";
import MagneticButton from "@/components/motion/MagneticButton";
import { Target, TrendingUp, Zap, ArrowRight } from "lucide-react";
import { BOOKING_URL } from "@/lib/site";
import { buildPageMetadata } from "@/lib/pageMetadata";

// Homepage-tuned metadata. This is the single highest-value <title> on
// the site, so it targets the terms we actually want to rank for rather
// than falling back to the generic root-layout default. The root layout's
// title template appends " | Blackline Strategy Partners".
export const metadata = buildPageMetadata({
  title: "Business Strategy Consultant for Founders",
  description:
    "Blackline Strategy Partners helps founders and business leaders find the one constraint holding back growth — and build a clear, executable path forward. Houston-based, serving founders nationwide.",
  path: "/",
});

// ISR rather than force-dynamic. Only BlogTeaser reads from Appwrite; the
// rest of the page is static. Caching the rendered page for 5 minutes
// gives fast TTFB + CDN caching for the overwhelming majority of visits,
// while the publish action's revalidatePath("/") flushes it instantly
// when a new post is published.
export const revalidate = 300;

const pillars = [
  {
    icon: Target,
    title: "Clarity",
    description:
      "We diagnose what's holding your business back — no fluff, just sharp, honest analysis.",
  },
  {
    icon: TrendingUp,
    title: "Strategy",
    description:
      "Every session produces actionable strategy you can execute immediately.",
  },
  {
    icon: Zap,
    title: "Momentum",
    description:
      "We help you build systems that create sustained forward motion and growth.",
  },
];

export default async function Home() {
  return (
    <>
      <Hero />

      {/* Sectors served — continuous marquee right under the hero so the
          first thing below the fold tells visitors who we work with. */}
      <IndustryMarquee />

      {/* About teaser */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <AnimateOnScroll variant="fade-up">
            <div className="max-w-2xl mb-16">
              <p className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-4">
                Why Blackline
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
                Strategic clarity for founders who are ready to grow
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Blackline Strategy Partners is a consulting firm built for
                founders and business leaders who are stuck, scaling, or
                pivoting.
              </p>
            </div>
          </AnimateOnScroll>

          {/* Pillar cards: 3D tilt on hover + numbered, with the
              hover state already wired (border + icon flip from the
              original design). The 3D tilt is intentionally subtle. */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {pillars.map((pillar, i) => (
              <AnimateOnScroll
                key={pillar.title}
                variant="fade-up"
                delay={i * 150}
              >
                <Tilt3D max={5} className="h-full">
                  <div className="group relative p-8 border border-gray-200 rounded-lg hover:border-black transition-colors h-full bg-white">
                    {/* Number watermark — large, low-opacity numeral
                        that grounds the card visually. */}
                    <span className="absolute top-4 right-6 text-6xl font-bold text-gray-100 select-none pointer-events-none">
                      0{i + 1}
                    </span>
                    <div className="relative w-12 h-12 flex items-center justify-center bg-gray-100 rounded-lg mb-6 group-hover:bg-black group-hover:text-white transition-colors">
                      <pillar.icon size={24} />
                    </div>
                    <h3 className="relative text-xl font-semibold text-black mb-3">
                      {pillar.title}
                    </h3>
                    <p className="relative text-gray-600 text-sm leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </Tilt3D>
              </AnimateOnScroll>
            ))}
          </div>

          <AnimateOnScroll variant="fade-up" delay={450}>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-sm font-medium text-black hover:text-gray-600 transition-colors"
            >
              Learn more about us
              <ArrowRight size={16} />
            </Link>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Typography pull-quote panel — replaces the previous generic
          Unsplash image divider with something brand-native. The grid
          texture + black canvas signals seriousness; the quote does
          the heavy emotional lift. */}
      <section className="relative py-28 md:py-40 bg-black text-white overflow-hidden">
        <GridBackground size={100} opacity={0.06} color="#fff" fadeEdges />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <AnimateOnScroll variant="fade-up">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-8">
              The Premise
            </p>
            <p className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.15]">
              Most founders don&apos;t need more advice.
              <br />
              <span className="text-gray-400">
                They need someone to name the actual constraint —
              </span>
              <br />
              and the courage to act on it.
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Stats — count-up animation, dark surface for visual rhythm */}
      <StatsStrip />

      {/* Who we work with */}
      <BestFitClients />

      {/* In-body links to the location pages. They otherwise only get
          sitewide header/footer links, which search engines discount —
          this passes real contextual equity from the highest-authority
          page on the site. */}
      <RelatedLinks
        eyebrow="Texas Locations"
        heading="Business strategy consulting across Texas"
        links={LOCATION_LIST.map((l) => ({
          href: `/${l.urlSlug}`,
          label: `Business consultant in ${l.city}`,
          description: `${l.industries.slice(0, 3).join(", ")}, and more.`,
        }))}
      />

      {/* Social proof */}
      <Testimonials />

      {/* Services teaser */}
      <section className="py-24 md:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <AnimateOnScroll variant="fade-up">
            <p className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-4">
              What We Do
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
              Services built for growth-stage founders
            </h2>
            <p className="text-gray-600 leading-relaxed max-w-xl mx-auto mb-10">
              From a focused diagnostic session to ongoing strategic advisory,
              choose the level of partnership that matches where you are.
            </p>
          </AnimateOnScroll>
          <AnimateOnScroll variant="fade-up" delay={200}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 bg-black text-white text-sm font-medium px-8 py-4 rounded hover:bg-gray-800 transition-colors"
              >
                View Services
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 border border-gray-300 text-sm font-medium px-8 py-4 rounded hover:border-gray-400 transition-colors"
              >
                See Pricing
              </Link>
              <Link
                href="/tools"
                className="inline-flex items-center justify-center gap-2 border border-gray-300 text-sm font-medium px-8 py-4 rounded hover:border-gray-400 transition-colors"
              >
                Free Tools
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* From our blog — async server component; renders nothing if no posts */}
      <BlogTeaser />

      {/* CTA section — magnetic button + grid background */}
      <section className="relative py-24 md:py-32 bg-black text-white overflow-hidden">
        <GridBackground size={80} opacity={0.06} color="#fff" fadeEdges />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <AnimateOnScroll variant="fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to move forward?
            </h2>
            <p className="text-gray-400 leading-relaxed mb-10">
              Pick a time that works for you and we&apos;ll walk through your
              business and the right next step — no prep required.
            </p>
            <MagneticButton
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              strength={0.25}
              className="inline-flex items-center justify-center gap-2 bg-white text-black text-sm font-medium px-8 py-4 rounded hover:bg-gray-100 transition-colors"
            >
              Book a Session
              <ArrowRight size={16} />
            </MagneticButton>
          </AnimateOnScroll>
        </div>
      </section>
    </>
  );
}
