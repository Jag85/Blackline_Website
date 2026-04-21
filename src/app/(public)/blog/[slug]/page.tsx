import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, ArrowRight } from "lucide-react";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { getPostBySlug } from "@/lib/appwrite/posts";
import { getImageUrl } from "@/lib/appwrite/storage";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post not found | Blackline" };
  return {
    title: `${post.title} | Blackline Strategy Partners`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.featuredImageId
        ? [getImageUrl(post.featuredImageId, { width: 1200 }) || ""]
        : [],
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
    <div className="pt-20">
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
            <AnimateOnScroll variant="fade-up">
              <div className="prose prose-lg prose-neutral max-w-none prose-headings:font-bold prose-headings:text-black prose-a:text-black prose-a:underline-offset-4 prose-strong:text-black prose-blockquote:border-l-black prose-blockquote:text-gray-700">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {post.content}
                </ReactMarkdown>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-black text-white">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Want strategy insights like this in your inbox?
            </h2>
            <p className="text-gray-400 mb-8">
              Subscribe via the footer, or book a strategy session to put these
              ideas into practice.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-white text-black text-sm font-medium px-8 py-4 rounded hover:bg-gray-100 transition-colors"
            >
              Book a Session
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </article>
    </div>
  );
}
