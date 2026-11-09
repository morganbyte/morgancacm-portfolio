import { projects } from "../data/projects";
import { localePath, type Locale } from "../lib/i18n";
import { GlobeIcon } from "./Icons";

const copy = {
  es: { featured: "Destacados", heading: "Proyectos", live: "Sitio", all: "Ver todos los proyectos" },
  en: { featured: "Featured work", heading: "Projects", live: "Live", all: "View all projects" },
};

type ProjectsProps = {
  lang: Locale;
  limit?: number;
  showHeader?: boolean;
  showViewAll?: boolean;
};

export default function Projects({
  lang,
  limit,
  showHeader = true,
  showViewAll = false,
}: ProjectsProps) {
  const t = copy[lang];
  const list = typeof limit === "number" ? projects.slice(0, limit) : projects;

  return (
    <section className="mb-20">
      {showHeader && (
        <div className="mb-6 flex items-baseline justify-between border-b border-border pb-2">
          <h2 className="text-xs uppercase tracking-wider text-muted">
            {limit ? t.featured : t.heading}
          </h2>
        </div>
      )}

      <ul className="divide-y divide-border">
        {list.map((project) => (
          <li key={project.title} className="flex flex-col gap-2 py-5">
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="text-base font-medium text-foreground">
                {project.title}
              </h3>
              <span className="shrink-0 text-xs text-muted">
                {project.year}
              </span>
            </div>

            <p className="text-sm leading-relaxed text-foreground/70">
              {project.description[lang]}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              <a
                href={project.live}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-subtle/30 px-2.5 py-1 text-xs text-muted transition-colors hover:border-foreground/20 hover:text-foreground"
              >
                <GlobeIcon className="size-3.5" />
                {t.live}
              </a>
            </div>
          </li>
        ))}
      </ul>

      {showViewAll && (
        <div className="mt-6">
          <a
            href={localePath(lang, "/work")}
            className="group inline-flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-foreground"
          >
            {t.all}
            <span
              aria-hidden
              className="transition-transform group-hover:translate-x-0.5"
            >
              →
            </span>
          </a>
        </div>
      )}
    </section>
  );
}
