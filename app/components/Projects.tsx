import { projects } from "../data/projects";
import { GithubIcon, GlobeIcon } from "./Icons";

type ProjectsProps = {
  limit?: number;
  showHeader?: boolean;
  showViewAll?: boolean;
};

export default function Projects({
  limit,
  showHeader = true,
  showViewAll = false,
}: ProjectsProps) {
  const list = typeof limit === "number" ? projects.slice(0, limit) : projects;

  return (
    <section className="mb-20">
      {showHeader && (
        <div className="mb-6 flex items-baseline justify-between border-b border-border pb-2">
          <h2 className="font-mono text-xs uppercase tracking-wider text-muted">
            {limit ? "Featured work" : "Projects"}
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
              <span className="shrink-0 font-mono text-xs text-muted">
                {project.year}
              </span>
            </div>

            <p className="text-sm leading-relaxed text-foreground/70">
              {project.description}
            </p>

            <ul className="mt-1 flex flex-wrap gap-1.5">
              {project.stack.map((tech) => (
                <li
                  key={tech}
                  className="font-mono text-[10px] uppercase tracking-wider text-muted"
                >
                  {tech}
                </li>
              ))}
            </ul>

            <div className="mt-3 flex flex-wrap gap-2">
              <a
                href={project.live}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-subtle/30 px-2.5 py-1 font-mono text-xs text-muted transition-colors hover:border-foreground/20 hover:text-foreground"
              >
                <GlobeIcon className="size-3.5" />
                Live
              </a>
              <a
                href={project.source}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-subtle/30 px-2.5 py-1 font-mono text-xs text-muted transition-colors hover:border-foreground/20 hover:text-foreground"
              >
                <GithubIcon className="size-3.5" />
                Source
              </a>
            </div>
          </li>
        ))}
      </ul>

      {showViewAll && (
        <div className="mt-6">
          <a
            href="/work"
            className="group inline-flex items-center gap-1.5 font-mono text-xs text-muted transition-colors hover:text-foreground"
          >
            View all projects
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
