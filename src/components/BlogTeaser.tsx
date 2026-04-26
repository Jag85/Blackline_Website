import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { ArrowRight } from "lucide-react";
import AnimateOnScroll from "./AnimateOnScroll";
import { listPublishedPosts } from "@/lib/appwrite/posts";
import { getImageUrl } from "@/lib/appwrite/storage";

/**
 * Async server component. Fetches the 3 most recent published posts
 * from Appwrite and renders them as a "From Our Blog" section. If
 * there are zero published posts, the entire section is skipped so
 * the home page doesn't show an awkward empty block.
 */
export default async function BlogTeaser() {
  let posts;
  try {
    const all = await listPublishedPosts();
    posts = all.slice(0, 3);
  } catch {
    posts = [];
  }

  if (posts.length === 0) return null;

  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <AnimateOnScroll variant="fade-up">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-4">
                From Our Blog
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
                Strategy insights for founders
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Essays, lessons, and tactical thinking on clarity, momentum,
                and growth.
              </p>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-medium text-black hover:gap-3 transition-all shrink-0"
            >
              View all posts
              <ArrowRight size={16} />
            </Link>
          </div>
        </AnimateOnScroll>

        <div className="grid md:grid-cols-3 gap-8">
          {posts.map((post, i) => {
            const imgUrl = getImageUrl(post.featuredImageId, {
              width: 800,
              quality: 80,
            });
            return (
              <AnimateOnScroll
                key={post.$id}
                variant="fade-up"
                delay={i * 120}
              >
                <Link href={`/blog/${post.slug}`} className="group block h-full">
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
                          {format(new Date(post.publishedAt), "MMMM d, yyyy")}
                        </p>
                      )}
                      <h3 className="text-lg font-bold text-black mb-3 group-hover:text-gray-700 transition-colors leading-snug">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
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
      </div>
    </section>
  );
}
