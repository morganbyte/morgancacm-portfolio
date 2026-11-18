import type { NextConfig } from "next";

// main → production, develop → staging, other branches → preview.
// See app/lib/env.ts.
function appEnv() {
  if (process.env.VERCEL_ENV === "production") return "production";
  if (process.env.VERCEL_ENV === "preview") {
    return process.env.VERCEL_GIT_COMMIT_REF === "develop" ? "staging" : "preview";
  }
  return "local";
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: { NEXT_PUBLIC_APP_ENV: appEnv() },
  // ditta reads content/projects/*.md at runtime (app/data/knowledge.ts).
  outputFileTracingIncludes: { "/api/chat": ["./content/**/*.md"] },
  // The site is English-only. Old /en and /es links land on the same page.
  async redirects() {
    return [
      { source: "/en", destination: "/", permanent: true },
      { source: "/en/:path*", destination: "/:path*", permanent: true },
      { source: "/es", destination: "/", permanent: true },
      { source: "/es/:path*", destination: "/:path*", permanent: true },
      // One-screen portfolio: ditta answers what these pages used to show.
      { source: "/about", destination: "/", permanent: false },
      { source: "/work", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;
