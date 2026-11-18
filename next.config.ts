import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // English used to live under /en; Spanish used to be the root.
  async redirects() {
    return [
      { source: "/en", destination: "/", permanent: true },
      { source: "/en/:path*", destination: "/:path*", permanent: true },
    ];
  },
  experimental: {
    globalNotFound: true,
  },
};

export default nextConfig;
