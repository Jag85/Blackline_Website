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
};

export default nextConfig;
