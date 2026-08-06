import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, ArrowRight } from "lucide-react";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import RelatedLinks from "@/components/RelatedLinks";
import ScrollProgress from "@/components/motion/ScrollProgress";
import JsonLd from "@/components/JsonLd";
import { getPostBySlug } from "@/lib/appwrite/posts";
import { getImageUrl } from "@/lib/appwrite/storage";
import { articleSchema, breadcrumbSchema } from "@/lib/schema";
import { SITE_NAME, BOOKING_URL } from "@/lib/site";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// ISR: each post is rendered on demand and cached for 5 minutes.
// `revalidatePath("/blog/<slug>")` in the publish/update action flushes a
// post the moment it's edited, so the cache window only affects passive
// traffic.
export const revalidate = 300;

// Returning [] (rather than omitting this) opts the dynamic segment into
// the static/ISR pipeline with on-demand params: nothing is pre-rendered
// at build (the build env has no Appwrite credentials), but each slug
// requested at runtime is rendered once and cached for `revalidate`
// seconds instead of being fully server-rendered on every hit.
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post not found", robots: { index: false } };

  const imageUrl =
    post.featuredImageId &&
    getImageUrl(post.featuredImageId, { width: 1200, quality: 85 });
  const path = `/blog/${post.slug}`;

  // Per-post SEO overrides win, with a clean fallback to title/excerpt
  // for any post created before the override fields existed.
  const seoTitle = post.metaTitle?.trim() || post.title;
  const seoDescription = post.metaDescription?.trim() || post.excerpt;

  return {
    title: seoTitle,
    description: seoDescription,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      title: seoTitle,
      description: seoDescription,
      url: path,
      siteName: SITE_NAME,
      publishedTime: post.publishedAt || undefined,
      modifiedTime: post.$updatedAt,
      images: imageUrl ? [imageUrl] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDescription,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const imgUrl = getImageUrl(post.featuredImageId, {
    width: 1600,
    quality: 90,
  });

  return (
    <div className="pt-28 md:pt-32">
      {/* Reading-progress bar pinned to the top of the viewport.
          Useful on long-form posts; ignored everywhere else. */}
      <ScrollProgress />
      <JsonLd
        data={[
          articleSchema({
            title: post.title,
            description: post.excerpt,
            slug: post.slug,
            imageUrl: imgUrl,
            publishedAt: post.publishedAt,
            updatedAt: post.$updatedAt,
            authorName: post.authorEmail,
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
        ]}
      />
      <article>
        <header className="bg-gray-50 py-16 md:py-24">
          <div className="max-w-3xl mx-auto px-6">
            <AnimateOnScroll variant="fade-up">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black mb-8 transition-colors"
              >
                <ArrowLeft size={14} />
                Back to all posts
              </Link>
              {post.publishedAt && (
                <p className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-4">
                  {format(new Date(post.publishedAt), "MMMM d, yyyy")}
                </p>
              )}
              <h1 className="text-4xl md:text-5xl font-bold text-black leading-tight mb-6">
                {post.title}
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                {post.excerpt}
              </p>
            </AnimateOnScroll>
          </div>
        </header>

        {imgUrl && (
          <div className="max-w-5xl mx-auto px-6 -mt-8 mb-12">
            <AnimateOnScroll variant="fade-in">
              <div className="aspect-[16/9] relative rounded-lg overflow-hidden shadow-xl">
                <Image
                  src={imgUrl}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  unoptimized
                />
              </div>
            </AnimateOnScroll>
          </div>
        )}

        <section className="py-12 md:py-16 bg-white">
          <div className="max-w-3xl mx-auto px-6">
            {/*
              Body content is intentionally NOT wrapped in <AnimateOnScroll>.
              That wrapper starts at opacity-0 and only fades in when an
              IntersectionObserver reports the element is 15% visible — for
              tall posts (>5000px), that threshold can be borderline, and
              if hydration or the observer fails for any reason the post
              body stays permanently invisible despite being in the DOM.
              The content is the whole point of the page; it must render
              unconditionally.
            */}
            <div className="prose prose-lg prose-neutral max-w-none prose-headings:font-bold prose-headings:text-black prose-a:text-black prose-a:underline-offset-4 prose-strong:text-black prose-blockquote:border-l-black prose-blockquote:text-gray-700">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {post.content}
              </ReactMarkdown>
            </div>
          </div>
        </section>

        {/* Contextual links out of the article. Blog posts previously
            linked only back to /blog, so they passed no equity to the
            commercial pages and sat in their own silo — which also hurts
            their own chance of being indexed. */}
        <RelatedLinks
          eyebrow="Put This Into Practice"
          heading="Related tools and services"
          tone="gray"
          links={[
            {
              href: "/scorecard",
              label: "Free FOCUS Founder Scorecard",
              description:
                "Diagnose the primary business bottleneck limiting your growth in about five minutes.",
            },
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
                "Flat, transparent pricing — sessions from $297, ongoing advisory from $1,500/month.",
            },
          ]}
        />

        <section className="py-16 md:py-24 bg-black text-white">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Want strategy insights like this in your inbox?
            </h2>
            <p className="text-gray-400 mb-8">
              Subscribe via the footer, or book a strategy session to put these
              ideas into practice.
            </p>
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white text-black text-sm font-medium px-8 py-4 rounded hover:bg-gray-100 transition-colors"
            >
              Book a Session
              <ArrowRight size={16} />
            </a>
          </div>
        </section>
      </article>
    </div>
  );
}
