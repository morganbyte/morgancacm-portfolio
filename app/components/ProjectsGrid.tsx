import Link from "next/link";
import { projects, type Project } from "../data/projects";
import { localePath, type Locale } from "../lib/i18n";
import { ArrowUpRightIcon } from "./Icons";
import LiveUserCount from "./LiveUserCount";
import { Badge } from "./ui/badge";

const copy = {
  en: { heading: "Work", all: "All work", read: "Read case study", visit: "Visit" },
  es: { heading: "Proyectos", all: "Ver todos", read: "Ver caso de estudio", visit: "Visitar" },
};

function ProjectCard({ project, lang }: { project: Project; lang: Locale }) {
  const t = copy[lang];
  const href = localePath(lang, `/work/${project.slug}`);

  return (
    <article
      className={`group relative flex flex-col gap-4 rounded-xl border border-border bg-subtle/20 p-5 transition-colors hover:border-foreground/20 hover:bg-subtle/40 ${
        project.featured ? "sm:p-6" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className={`font-medium text-foreground ${project.featured ? "text-lg" : "text-base"}`}>
            {/* Stretched link: the whole card opens the case study. */}
            <Link
              href={href}
              className="after:absolute after:inset-0 after:rounded-xl focus-visible:outline-none focus-visible:after:ring-1 focus-visible:after:ring-foreground/40"
            >
              {project.title}
            </Link>
          </h3>
          {project.live && (
            <p className="truncate text-xs text-muted">{new URL(project.live).host}</p>
          )}
        </div>
        {project.year && <Badge variant="outline">{project.year}</Badge>}
      </div>

      <p className="text-sm leading-relaxed text-foreground/75">{project.summary[lang]}</p>

      {project.liveUsers && <LiveUserCount lang={lang} />}

      {project.stack.length > 0 && (
        <ul className="flex flex-wrap gap-1.5">
          {project.stack.map((s) => (
            <li key={s}>
              <Badge variant="secondary" className="normal-case tracking-normal text-[11px]">
                {s}
              </Badge>
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-center gap-4 text-sm">
        <span className="inline-flex items-center gap-1.5 text-muted transition-colors group-hover:text-foreground">
          {t.read}
          <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
        </span>
        {project.live && (
          // Sits above the stretched link so it stays clickable on its own.
          <a
            href={project.live}
            target="_blank"
            rel="noreferrer"
            className="relative z-10 inline-flex items-center gap-1 text-muted transition-colors hover:text-foreground"
          >
            {t.visit}
            <ArrowUpRightIcon className="size-3.5" />
          </a>
        )}
      </div>
    </article>
  );
}

export function ProjectList({ lang }: { lang: Locale }) {
  return (
    <div className="flex flex-col gap-3">
      {projects.map((project) => (
        <ProjectCard key={project.slug} project={project} lang={lang} />
      ))}
    </div>
  );
}

export default function ProjectsGrid({ lang }: { lang: Locale }) {
  const t = copy[lang];

  return (
    <section className="mb-20">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-base font-medium text-foreground">{t.heading}</h2>
        <Link
          href={localePath(lang, "/work")}
          className="group inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-foreground"
        >
          {t.all}
          <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
        </Link>
      </div>
      <ProjectList lang={lang} />
    </section>
  );
}
