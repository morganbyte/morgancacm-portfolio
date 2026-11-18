import type { Metadata } from "next";
import { profile } from "../data/profile";
import { alternates, type Locale } from "../lib/i18n";
import About from "./About";
import Contact from "./Contact";
import AboutChat from "./AboutChat";
import AsciiPortrait from "./AsciiPortrait";
import { ProjectList } from "./ProjectsGrid";

// Page bodies shared by the English (/) and Spanish (/es) routes.

const copy = {
  en: {
    portrait: "Portrait of Morgan drawn with characters",
    about: {
      title: `About | ${profile.name}`,
      description: `About ${profile.name}, a backend-focused full-stack developer building real products with AI built in.`,
      eyebrow: "About",
      heading: "I turn product ideas into software that runs in production.",
    },
    work: {
      title: `Work | ${profile.name}`,
      description: `Case studies by ${profile.name}: products built end-to-end, from data model to interface.`,
      eyebrow: "Work",
      heading: "Case studies.",
    },
  },
  es: {
    portrait: "Retrato de Morgan dibujado con caracteres",
    about: {
      title: `Sobre mí | ${profile.name}`,
      description: `Sobre ${profile.name}, desarrollador full-stack con foco en backend que construye productos reales con IA integrada.`,
      eyebrow: "Sobre mí",
      heading: "Convierto ideas de producto en software que funciona en producción.",
    },
    work: {
      title: `Proyectos | ${profile.name}`,
      description: `Casos de estudio de ${profile.name}: productos construidos de principio a fin, del modelo de datos a la interfaz.`,
      eyebrow: "Proyectos",
      heading: "Casos de estudio.",
    },
  },
};

function PageHeader({ eyebrow, heading }: { eyebrow: string; heading: string }) {
  return (
    <header className="mb-12">
      <p className="mb-2 text-xs tracking-wider text-muted">{eyebrow}</p>
      <h1 className="text-2xl font-medium tracking-tight text-foreground sm:text-3xl">{heading}</h1>
    </header>
  );
}

// Narrow reading column for the secondary pages (about, work, case studies).
export function Column({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-2xl px-6 pb-24 pt-16 sm:pt-24">{children}</div>;
}

export function homeMetadata(lang: Locale): Metadata {
  return { alternates: alternates(lang, "/") };
}

export function HomePage({ lang }: { lang: Locale }) {
  return (
    <div className="mx-auto grid min-h-dvh max-w-6xl grid-cols-1 content-center items-center gap-8 px-6 py-10 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
      {/* No visible text by design; screen readers and search engines still get a heading. */}
      <h1 className="sr-only">
        {profile.name}: {profile.role[lang]}
      </h1>
      {/* Width is capped so the portrait's height always fits the viewport. */}
      <div className="mx-auto w-full" style={{ maxWidth: "calc((100dvh - 5rem) * 1.12)" }}>
        <AsciiPortrait label={copy[lang].portrait} />
      </div>
      <div className="h-[min(560px,75dvh)] w-full lg:h-[min(640px,calc(100dvh-5rem))]">
        <AboutChat lang={lang} />
      </div>
    </div>
  );
}

export function aboutMetadata(lang: Locale): Metadata {
  const t = copy[lang].about;
  return { title: t.title, description: t.description, alternates: alternates(lang, "/about") };
}

export function AboutPage({ lang }: { lang: Locale }) {
  const t = copy[lang].about;
  return (
    <Column>
      <PageHeader eyebrow={t.eyebrow} heading={t.heading} />
      <About lang={lang} />
      <Contact lang={lang} />
    </Column>
  );
}

export function workMetadata(lang: Locale): Metadata {
  const t = copy[lang].work;
  return { title: t.title, description: t.description, alternates: alternates(lang, "/work") };
}

export function WorkPage({ lang }: { lang: Locale }) {
  const t = copy[lang].work;
  return (
    <Column>
      <PageHeader eyebrow={t.eyebrow} heading={t.heading} />
      <ProjectList lang={lang} />
    </Column>
  );
}
