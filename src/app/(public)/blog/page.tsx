import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { ArrowRight } from "lucide-react";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import JsonLd from "@/components/JsonLd";
import Pagination, { parsePageParam } from "@/components/Pagination";
import { listPublishedPostsPage } from "@/lib/appwrite/posts";
import { getImageUrl } from "@/lib/appwrite/storage";
import { buildPageMetadata } from "@/lib/pageMetadata";
import { breadcrumbSchema } from "@/lib/schema";
import { absoluteUrl, SITE_NAME } from "@/lib/site";

const PAGE_SIZE = 9;

export const metadata = buildPageMetadata({
  title: "Blog",
  description:
    "Strategy insights, founder lessons, and growth essays from the Blackline team.",
  path: "/blog",
});

// Always render at request time so newly published posts show up immediately
export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function BlogPage({ searchParams }: PageProps) {
  const { page: pageParam } = await searchParams;
  const page = parsePageParam(pageParam);
  const { posts, total } = await listPublishedPostsPage({
    page,
    pageSize: PAGE_SIZE,
  });

  // Blog/CollectionPage schema lets Google understand this is a blog hub
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${SITE_NAME} — Blog`,
    description:
      "Strategy insights, founder lessons, and growth essays from Blackline Strategy Partners.",
    url: absoluteUrl("/blog"),
    blogPost: posts.slice(0, 20).map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      description: p.excerpt,
      url: absoluteUrl(`/blog/${p.slug}`),
      datePublished: p.publishedAt || p.$createdAt,
      dateModified: p.$updatedAt,
    })),
  };

  return (
    <div className="pt-28 md:pt-32">
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
          ]),
          blogSchema,
        ]}
      />
      <div className="bg-gray-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <AnimateOnScroll variant="fade-up">
            <p className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-4">
              Insights
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
              Blackline Blog
            </h1>
            <p className="text-gray-600 max-w-2xl">
              Strategy essays, founder lessons, and tactical thinking on
              clarity, momentum, and growth.
            </p>
          </AnimateOnScroll>
        </div>
      </div>

      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          {posts.length === 0 ? (
            <div className="max-w-xl mx-auto text-center py-16">
              <p className="text-gray-500 text-lg">
                No posts published yet — check back soon.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, i) => {
                const imgUrl = getImageUrl(post.featuredImageId, {
                  width: 800,
                  quality: 80,
                });
                return (
                  <AnimateOnScroll
                    key={post.$id}
                    variant="fade-up"
                    delay={(i % 3) * 100}
                  >
                    <Link
                      href={`/blog/${post.slug}`}
                      className="group block h-full"
                    >
                      <article className="h-full flex flex-col border border-gray-200 rounded-lg overflow-hidden hover:border-black hover:shadow-lg transition-all">
                        {imgUrl ? (
                          <div className="aspect-[16/9] relative overflow-hidden bg-gray-100">
                            <Image
                              src={imgUrl}
                              alt={post.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              unoptimized
                            />
                          </div>
                        ) : (
                          <div className="aspect-[16/9] bg-gradient-to-br from-gray-100 to-gray-200" />
                        )}
                        <div className="p-6 flex flex-col flex-1">
                          {post.publishedAt && (
                            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
                              {format(
                                new Date(post.publishedAt),
                                "MMMM d, yyyy"
                              )}
                            </p>
                          )}
                          <h2 className="text-xl font-bold text-black mb-3 group-hover:text-gray-700 transition-colors">
                            {post.title}
                          </h2>
                          <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-1">
                            {post.excerpt}
                          </p>
                          <span className="inline-flex items-center gap-2 text-sm font-medium text-black group-hover:gap-3 transition-all">
                            Read article
                            <ArrowRight size={14} />
                          </span>
                        </div>
                      </article>
                    </Link>
                  </AnimateOnScroll>
                );
              })}
            </div>
          )}

          <Pagination
            page={page}
            pageSize={PAGE_SIZE}
            total={total}
            basePath="/blog"
          />
        </div>
      </section>
    </div>
  );
}
