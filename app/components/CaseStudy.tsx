import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, projects } from "../data/projects";
import { profile } from "../data/profile";
import { ArrowLeftIcon, ArrowUpRightIcon, GithubIcon } from "./Icons";
import LiveUserCount from "./LiveUserCount";
import Placeholder, { isDev } from "./Placeholder";
import { Badge } from "./ui/badge";

const copy = {
  back: "Back to ditta",
  visit: "Visit site",
  code: "Source",
  problem: "The problem",
  architecture: "Architecture",
  decisions: "Key decisions",
  results: "Results",
  lessons: "What I learned",
  stack: "Stack",
  todo: {
    problem: "What problem does it solve, and for whom? 2–4 sentences.",
    architecture: "List the system's pieces top to bottom (frontend → API → data → integrations).",
    decisions: "2–3 hard calls: what you chose, what you gave up, why. This is what tech leads read.",
    results: "Real numbers: users, daily use, latency, uptime, items processed.",
    lessons: "What broke, what you'd do differently.",
    stack: "Add the stack to this project in app/data/projects.ts.",
  },
};

export function caseStudyParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export function caseStudyMetadata(slug: string): Metadata {
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: `${project.title} | ${profile.name}`,
    description: project.summary,
    alternates: { canonical: `/work/${slug}` },
  };
}

// With no content: a TODO box in dev, nothing at all in production.
function Section({
  title,
  todo,
  children,
}: {
  title: string;
  todo: string;
  children: React.ReactNode;
}) {
  if (!children && !isDev) return null;
  return (
    <section className="mt-12">
      <h2 className="mb-4 text-xs uppercase tracking-wider text-muted">{title}</h2>
      {children || <Placeholder>{todo}</Placeholder>}
    </section>
  );
}

export function CaseStudyPage({ slug }: { slug: string }) {
  const project = getProject(slug);
  if (!project) notFound();
  const t = copy;
  const cs = project.caseStudy;

  return (
    <article className="mx-auto max-w-2xl px-6 pb-24 pt-16 sm:pt-24">
      <Link
        href={"/"}
        className="mb-10 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-foreground"
      >
        <ArrowLeftIcon className="size-4" />
        {t.back}
      </Link>

      <header>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-medium tracking-tight text-foreground">{project.title}</h1>
          {project.year && <Badge variant="outline">{project.year}</Badge>}
        </div>
        <p className="mt-4 max-w-prose text-lg leading-relaxed text-foreground/80">
          {project.summary}
        </p>
        {project.liveUsers && (
          <div className="mt-4">
            <LiveUserCount />
          </div>
        )}
        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-foreground underline-offset-4 hover:underline"
            >
              {t.visit}
              <ArrowUpRightIcon className="size-3.5" />
            </a>
          )}
          {project.repo && (
            <a
              href={project.repo}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-foreground underline-offset-4 hover:underline"
            >
              <GithubIcon className="size-3.5" />
              {t.code}
            </a>
          )}
        </div>
      </header>

      <Section title={t.problem} todo={t.todo.problem}>
        {cs.problem && (
          <p className="max-w-prose leading-relaxed text-foreground/80">{cs.problem}</p>
        )}
      </Section>

      <Section title={t.architecture} todo={t.todo.architecture}>
        {!!cs.architecture?.length && (
          <ol className="flex flex-col items-stretch">
            {cs.architecture.map((node, i) => (
              <li key={node.name} className="flex flex-col items-center">
                {i > 0 && <span aria-hidden className="h-5 w-px bg-border" />}
                <div className="w-full rounded-lg border border-border bg-subtle/20 px-4 py-3">
                  <p className="text-sm font-medium text-foreground">{node.name}</p>
                  <p className="text-sm text-muted">{node.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </Section>

      <Section title={t.decisions} todo={t.todo.decisions}>
        {!!cs.decisions?.length && (
          <div className="space-y-6">
            {cs.decisions.map((d) => (
              <div key={d.title}>
                <h3 className="mb-1.5 font-medium text-foreground">{d.title}</h3>
                <p className="max-w-prose leading-relaxed text-foreground/80">{d.body}</p>
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section title={t.results} todo={t.todo.results}>
        {!!cs.results?.length && (
          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {cs.results.map((r) => (
              <div key={r.label} className="rounded-lg border border-border bg-subtle/20 px-4 py-3">
                <dt className="sr-only">{r.label}</dt>
                <dd className="text-2xl font-medium tabular-nums text-foreground">{r.value}</dd>
                <dd className="text-xs text-muted">{r.label}</dd>
              </div>
            ))}
          </dl>
        )}
      </Section>

      <Section title={t.lessons} todo={t.todo.lessons}>
        {cs.lessons && (
          <p className="max-w-prose leading-relaxed text-foreground/80">{cs.lessons}</p>
        )}
      </Section>

      <Section title={t.stack} todo={t.todo.stack}>
        {project.stack.length > 0 && (
          <p className="text-foreground/80">{project.stack.join(" · ")}</p>
        )}
      </Section>
    </article>
  );
}
