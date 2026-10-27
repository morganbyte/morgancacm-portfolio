import { projects, type Project } from "../data/projects";
import { localePath, type Locale } from "../lib/i18n";
import { ArrowUpRightIcon, GithubIcon, UsersIcon } from "./Icons";
import { Badge } from "./ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

const copy = {
  es: { heading: "Proyectos", all: "Ver todo", source: "Código" },
  en: { heading: "Projects", all: "All work", source: "Source" },
};

function ProjectCard({ project, lang }: { project: Project; lang: Locale }) {
  const host = new URL(project.live).host;

  return (
    <Card className="group relative overflow-hidden transition-colors duration-200 hover:border-foreground/20 hover:bg-subtle/40">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      <CardHeader className="flex-row items-start justify-between gap-4">
        <div className="min-w-0 space-y-1.5">
          <CardTitle className="flex items-center gap-2">
            {/* The pseudo-element stretches this link over the whole card. */}
            <a
              href={project.live}
              target="_blank"
              rel="noreferrer"
              className="rounded-sm after:absolute after:inset-0 after:rounded-xl focus-visible:outline-none focus-visible:after:ring-1 focus-visible:after:ring-foreground/40"
            >
              {project.title}
            </a>
            <ArrowUpRightIcon className="size-3.5 -translate-x-1 text-muted opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:text-foreground group-hover:opacity-100" />
          </CardTitle>
          <p className="truncate font-mono text-xs text-muted">{host}</p>
        </div>

        <Badge variant="outline">{project.year}</Badge>
      </CardHeader>

      <CardContent className="space-y-3">
        <CardDescription>{project.description[lang]}</CardDescription>
        {project.highlight && (
          <p className="inline-flex items-center gap-1.5 font-mono text-xs text-foreground/80">
            <UsersIcon className="size-3.5 text-muted" />
            {project.highlight[lang]}
          </p>
        )}
      </CardContent>

      <CardFooter className="mx-5 flex-wrap justify-between gap-3 border-t border-border px-0 pt-4">
        <ul className="flex flex-wrap gap-1.5">
          {project.stack.map((tech) => (
            <li key={tech}>
              <Badge variant="secondary">{tech}</Badge>
            </li>
          ))}
        </ul>
        <a
          href={project.source}
          target="_blank"
          rel="noreferrer"
          className="relative z-10 ml-auto inline-flex items-center gap-1.5 rounded-md border border-border bg-background/40 px-2.5 py-1 font-mono text-xs text-muted transition-colors hover:border-foreground/20 hover:text-foreground"
        >
          <GithubIcon className="size-3.5" />
          {copy[lang].source}
        </a>
      </CardFooter>
    </Card>
  );
}

export default function ProjectsGrid({ lang }: { lang: Locale }) {
  const t = copy[lang];

  return (
    <section className="mb-20">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-base font-medium text-foreground">{t.heading}</h2>
        <a
          href={localePath(lang, "/work")}
          className="group inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-foreground"
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

      <div className="flex flex-col gap-3">
        {projects.map((project) => (
          <ProjectCard key={project.title} project={project} lang={lang} />
        ))}
      </div>
    </section>
  );
}
