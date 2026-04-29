import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cloud.appwrite.io",
      },
      // Cloud's regional endpoints (nyc.cloud.appwrite.io, fra.cloud..., etc.)
      // are subdomains; cover them with a wildcard so a region change
      // doesn't silently break image loading.
      {
        protocol: "https",
        hostname: "*.cloud.appwrite.io",
      },
      // Allow self-hosted Appwrite endpoints too (set via env var domain)
      ...(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT
        ? [
            {
              protocol: "https" as const,
              hostname: new URL(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
                .hostname,
            },
          ]
        : []),
    ],
  },
  experimental: {
    serverActions: {
      // Default is 1 MB, which a long blog post + a featured image upload
      // blows past easily — Netlify rejects with a 502. Bumping to 10 MB
      // covers any realistic blog post (the public-facing image upload
      // action also caps individual uploads at 5 MB).
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
