import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { profile } from "./data/profile";
import { isProduction } from "./lib/env";
import { SITE_URL } from "./lib/site";

export const metadata: Metadata = {
  title: `${profile.name} | Software Developer`,
  description: profile.tagline,
  metadataBase: new URL(SITE_URL),
  robots: isProduction ? undefined : { index: false, follow: false },
  alternates: { canonical: "/" },
  openGraph: {
    title: `${profile.name} | ${profile.role}`,
    description: profile.tagline,
    type: "website",
    locale: "en_US",
    url: "/",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="bg-background font-sans text-foreground antialiased">
        <main>{children}</main>
      </body>
    </html>
  );
}
