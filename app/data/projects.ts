/**
 * Anything left undefined in a case study shows up as a dashed
 * "to fill in" box while running `npm run dev`, and is hidden in production.
 */
export type CaseStudy = {
  /** What problem it solves and for whom. */
  problem?: string;
  /** Boxes of the architecture diagram, top to bottom. */
  architecture?: { name: string; detail: string }[];
  /** The hard calls: what you chose, what you gave up, and why. */
  decisions?: { title: string; body: string }[];
  /** Numbers. Small but real beats big and vague. */
  results?: { value: string; label: string }[];
  /** What went wrong / what you'd do differently. */
  lessons?: string;
};

export type Project = {
  slug: string;
  title: string;
  year?: string;
  /** One line shown on cards. */
  summary: string;
  stack: string[];
  live?: string;
  repo?: string;
  /** Public GitHub repo ("owner/name") with the project's docs. ditta reads its
   *  README, ARCHITECTURE and CHANGELOG (app/data/knowledge.ts). */
  docs?: string;
  /** Show Vekipper's live user count (app/api/vekipper-users). */
  liveUsers?: boolean;
  featured?: boolean;
  caseStudy: CaseStudy;
};

export const projects: Project[] = [
  {
    slug: "vekipper",
    title: "Vekipper",
    year: "2026",
    featured: true,
    summary: "A personal command center that brings Google Calendar, Tasks and Gmail onto one screen, with two-way sync and an integrated AI agent.",
    stack: ["TypeScript", "FastAPI", "Supabase", "Docker", "Vercel", "AI agent"],
    live: "https://vekipper.com",
    docs: "morganbyte/vekipper-docs",
    liveUsers: true,
    caseStudy: {
      problem: "Calendar, tasks and email live in three different Google apps, so planning a day means jumping between tabs. Vekipper puts them on a single screen built to stay open all day, and every change syncs both ways: edit something in Vekipper and it shows up in Google, and vice versa.",
      architecture: [
        { name: "Web app", detail: "TypeScript frontend, deployed on Vercel" },
        { name: "API", detail: "FastAPI service, containerized with Docker" },
        { name: "Data", detail: "Supabase (PostgreSQL + auth)" },
        { name: "Google APIs", detail: "Calendar, Tasks and Gmail, two-way sync" },
        { name: "AI agent", detail: "Integrated agent built on opencode" },
      ],
      // decisions: [...]  → how sync works, conflict handling, the AI agent
      // results:   [...]  → users (live), daily active, events synced, uptime
      // lessons:   {...}
    },
  },
  {
    slug: "zpenz",
    title: "zpenz",
    summary: "A web app to track income and expenses.",
    stack: [],
    caseStudy: {},
  },
  {
    slug: "wayuunext",
    title: "wayuunext",
    summary: "A website to help people learn Wayuunaiki, the language of the Wayuu people.",
    stack: [],
    caseStudy: {},
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
