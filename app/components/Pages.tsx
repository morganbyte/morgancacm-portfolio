import type { Metadata } from "next";
import { alternates, type Locale } from "../lib/i18n";
import About from "./About";
import Hero from "./Hero";
import Projects from "./Projects";
import ProjectsGrid from "./ProjectsGrid";

// Page bodies shared by the Spanish (/) and English (/en) routes.

const copy = {
  es: {
    about: {
      title: "Sobre mí | Portafolio de Andrés Morgan",
      description:
        "Sobre Andrés Morgan, desarrollador de software de Colombia que construye sistemas backend con Django, TypeScript, PostgreSQL y n8n.",
      eyebrow: "Sobre mí",
      heading: "Convierto mis ideas de producto en sistemas de software funcionales",
    },
    work: {
      title: "Proyectos | Portafolio de Andrés Morgan",
      description:
        "Proyectos de Andrés Morgan: productos y sistemas construidos de principio a fin, del modelo de datos a la interfaz.",
      eyebrow: "Proyectos",
      heading: "Proyectos seleccionados.",
    },
  },
  en: {
    about: {
      title: "About | Andrés Morgan's Portfolio",
      description:
        "About Andrés Morgan — a software developer from Colombia building backend systems with Django, TypeScript, PostgreSQL and n8n.",
      eyebrow: "About",
      heading: "I turn my product ideas into functional software systems",
    },
    work: {
      title: "Work | Andrés Morgan's Portfolio",
      description:
        "Selected projects by Andrés Morgan — products and systems built end-to-end, from data model to interface.",
      eyebrow: "Work",
      heading: "Selected work.",
    },
  },
};

function PageHeader({ eyebrow, heading }: { eyebrow: string; heading: string }) {
  return (
    <header className="mb-12">
      <p className="mb-2 font-mono text-xs tracking-wider text-muted">
        {eyebrow}
      </p>
      <h1 className="text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
        {heading}
      </h1>
    </header>
  );
}

export function homeMetadata(lang: Locale): Metadata {
  return { alternates: alternates(lang, "/") };
}

export function HomePage({ lang }: { lang: Locale }) {
  return (
    <>
      <Hero lang={lang} />
      <ProjectsGrid lang={lang} />
    </>
  );
}

export function aboutMetadata(lang: Locale): Metadata {
  const t = copy[lang].about;
  return {
    title: t.title,
    description: t.description,
    alternates: alternates(lang, "/about"),
  };
}

export function AboutPage({ lang }: { lang: Locale }) {
  const t = copy[lang].about;
  return (
    <>
      <PageHeader eyebrow={t.eyebrow} heading={t.heading} />
      <About lang={lang} />
    </>
  );
}

export function workMetadata(lang: Locale): Metadata {
  const t = copy[lang].work;
  return {
    title: t.title,
    description: t.description,
    alternates: alternates(lang, "/work"),
  };
}

export function WorkPage({ lang }: { lang: Locale }) {
  const t = copy[lang].work;
  return (
    <>
      <PageHeader eyebrow={t.eyebrow} heading={t.heading} />
      <Projects lang={lang} showHeader={false} />
    </>
  );
}
