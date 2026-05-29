import { projects, type Project } from "../data/projects";
import { ArrowUpRightIcon } from "./Icons";

function ProjectCard({ project }: { project: Project }) {
  const external = project.live.startsWith("http");

  return (
    <a
      href={project.live}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="group flex flex-col gap-2 rounded-xl border border-border bg-subtle/20 p-5 transition-all hover:border-foreground/20 hover:bg-subtle/40"
    >
      <div className="flex items-center gap-2">
        <h3 className="font-medium text-foreground">{project.title}</h3>
        <ArrowUpRightIcon className="size-3.5 -translate-x-1 text-muted opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:text-foreground group-hover:opacity-100" />
      </div>
      <p className="line-clamp-2 text-sm leading-relaxed text-foreground/60">
        {project.description}
      </p>
    </a>
  );
}

export default function ProjectsGrid() {
  const featured = projects.slice(0, 1);

  return (
    <section className="mb-20">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-base font-medium text-foreground">Projects</h2>
        <a
          href="/work"
          className="group inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-foreground"
        >
          All work
          <span
            aria-hidden
            className="transition-transform group-hover:translate-x-0.5"
          >
            →
          </span>
        </a>
      </div>

      <div className="flex flex-col gap-3">
        {featured.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
    </section>
  );
}
