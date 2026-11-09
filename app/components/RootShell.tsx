import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "../globals.css";
import { SITE_URL, type Locale } from "../lib/i18n";
import Navbar from "./Navbar";
import Footer from "./Footer";

const copy = {
  es: {
    title: "Inicio | Portafolio de Andrés Morgan",
    description:
      "Portafolio personal de Andrés Morgan, desarrollador de software enfocado en convertir ideas de producto en sistemas backend confiables.",
    ogTitle: "Andrés Morgan — Desarrollador de software",
    ogLocale: "es_CO",
  },
  en: {
    title: "Home | Andrés Morgan's Portfolio",
    description:
      "Personal portfolio of Andrés Morgan — a software developer focused on turning product ideas into reliable backend systems.",
    ogTitle: "Andrés Morgan — Software Developer",
    ogLocale: "en_US",
  },
};

export function siteMetadata(lang: Locale): Metadata {
  const t = copy[lang];
  return {
    title: t.title,
    description: t.description,
    metadataBase: new URL(SITE_URL),
    openGraph: {
      title: t.ogTitle,
      description: t.description,
      type: "website",
      locale: t.ogLocale,
      url: lang === "es" ? "/" : "/en",
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
    <html lang={lang} className={GeistSans.variable}>
      <body className="bg-background font-sans text-foreground antialiased">
        <div className="mx-auto flex min-h-screen max-w-6xl">
          <Navbar />
          <div className="flex min-w-0 flex-1 flex-col pb-14 md:border-l md:border-border md:pb-0">
            <main className="w-full max-w-2xl flex-1 px-6 pt-12 sm:pt-16 md:px-10">
              {children}
            </main>
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}
