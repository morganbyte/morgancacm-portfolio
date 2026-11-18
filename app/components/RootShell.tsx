import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import "../globals.css";
import { profile } from "../data/profile";
import { SITE_URL, localePath, type Locale } from "../lib/i18n";

const copy = {
  en: {
    title: `${profile.name} | Software Developer`,
    ogTitle: `${profile.name} | ${profile.role.en}`,
    ogLocale: "en_US",
  },
  es: {
    title: `${profile.name} | Desarrollador de software`,
    ogTitle: `${profile.name} | ${profile.role.es}`,
    ogLocale: "es_CO",
  },
};

export function siteMetadata(lang: Locale): Metadata {
  const t = copy[lang];
  return {
    title: t.title,
    description: profile.tagline[lang],
    metadataBase: new URL(SITE_URL),
    openGraph: {
      title: t.ogTitle,
      description: profile.tagline[lang],
      type: "website",
      locale: t.ogLocale,
      url: localePath(lang, "/"),
    },
  };
}

export default function RootShell({
  lang,
  children,
}: {
  lang: Locale;
  children: React.ReactNode;
}) {
  return (
    <html lang={lang} className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="bg-background font-sans text-foreground antialiased">
        <main>{children}</main>
      </body>
    </html>
  );
}
