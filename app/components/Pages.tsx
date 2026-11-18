import type { Metadata } from "next";
import { profile } from "../data/profile";
import About from "./About";
import Contact from "./Contact";
import AboutChat from "./AboutChat";
import AsciiPortrait from "./AsciiPortrait";
import PortraitFooter from "./PortraitFooter";
import { ProjectList } from "./ProjectsGrid";

const copy = {
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

export function HomePage() {
  return (
    <div className="mx-auto grid min-h-dvh max-w-6xl grid-cols-1 content-center items-center gap-8 px-6 py-10 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
      {/* No visible text by design; screen readers and search engines still get a heading. */}
      <h1 className="sr-only">
        {profile.name}: {profile.role}
      </h1>
      {/* Width is capped so the portrait's height always fits the viewport. */}
      <div className="mx-auto w-full" style={{ maxWidth: "calc((100dvh - 7rem) * 1.12)" }}>
        <AsciiPortrait label={copy.portrait} />
        <div className="mt-3">
          <PortraitFooter />
        </div>
      </div>
      <div className="h-[min(560px,75dvh)] w-full lg:h-[min(640px,calc(100dvh-5rem))]">
        <AboutChat />
      </div>
    </div>
  );
}

export const aboutMetadata: Metadata = {
  title: copy.about.title,
  description: copy.about.description,
  alternates: { canonical: "/about" },
};

export function AboutPage() {
  const t = copy.about;
  return (
    <Column>
      <PageHeader eyebrow={t.eyebrow} heading={t.heading} />
      <About />
      <Contact />
    </Column>
  );
}

export const workMetadata: Metadata = {
  title: copy.work.title,
  description: copy.work.description,
  alternates: { canonical: "/work" },
};

export function WorkPage() {
  const t = copy.work;
  return (
    <Column>
      <PageHeader eyebrow={t.eyebrow} heading={t.heading} />
      <ProjectList />
    </Column>
  );
}
