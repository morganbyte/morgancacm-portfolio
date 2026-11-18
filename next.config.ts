import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // The site is English-only. Old /en and /es links land on the same page.
  async redirects() {
    return [
      { source: "/en", destination: "/", permanent: true },
      { source: "/en/:path*", destination: "/:path*", permanent: true },
      { source: "/es", destination: "/", permanent: true },
      { source: "/es/:path*", destination: "/:path*", permanent: true },
    ];
  },
};

export default nextConfig;
