import type { NextConfig } from "next";

const IMMUTABLE_CACHE = "public, max-age=31536000, immutable";

const nextConfig: NextConfig = {
  experimental: {
    // Turbopack's on-disk cache kept serving a stale app/globals.css after the
    // stylesheet was rewritten: fresh markup, old CSS, both locally and on
    // Vercel (which restores the cache between deploys). A clean build is a
    // few seconds slower and always matches the source.
    turbopackFileSystemCacheForDev: false,
    turbopackFileSystemCacheForBuild: false,
  },
  async headers() {
    return [
      {
        source: "/images/:path*",
        headers: [{ key: "Cache-Control", value: IMMUTABLE_CACHE }],
      },
      {
        source: "/sounds/:path*",
        headers: [{ key: "Cache-Control", value: IMMUTABLE_CACHE }],
      },
      {
        source: "/:path*\\.(svg|ico|png|jpg|jpeg|webp|gif)",
        headers: [{ key: "Cache-Control", value: IMMUTABLE_CACHE }],
      },
    ];
  },
};

export default nextConfig;
