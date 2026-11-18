import type { Localized } from "../lib/i18n";

/**
 * Anything left undefined in a case study shows up as a dashed
 * "to fill in" box while running `npm run dev`, and is hidden in production.
 */
export type CaseStudy = {
  /** What problem it solves and for whom. */
  problem?: Localized;
  /** Boxes of the architecture diagram, top to bottom. */
  architecture?: { name: string; detail: Localized }[];
  /** The hard calls: what you chose, what you gave up, and why. */
  decisions?: { title: Localized; body: Localized }[];
  /** Numbers. Small but real beats big and vague. */
  results?: { value: string; label: Localized }[];
  /** What went wrong / what you'd do differently. */
  lessons?: Localized;
};

export type Project = {
  slug: string;
  title: string;
  year?: string;
  /** One line shown on cards. */
  summary: Localized;
  stack: string[];
  live?: string;
  repo?: string;
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
    summary: {
      en: "A personal command center that brings Google Calendar, Tasks and Gmail onto one screen, with two-way sync and an integrated AI agent.",
      es: "Centro de mando personal que reúne Google Calendar, Tasks y Gmail en una sola pantalla, con sincronización en ambos sentidos y un agente de IA integrado.",
    },
    stack: ["TypeScript", "FastAPI", "Supabase", "Docker", "Vercel", "AI agent"],
    live: "https://vekipper.com",
    liveUsers: true,
    caseStudy: {
      problem: {
        en: "Calendar, tasks and email live in three different Google apps, so planning a day means jumping between tabs. Vekipper puts them on a single screen built to stay open all day, and every change syncs both ways: edit something in Vekipper and it shows up in Google, and vice versa.",
        es: "El calendario, las tareas y el correo viven en tres apps distintas de Google, así que planear el día obliga a saltar entre pestañas. Vekipper los junta en una sola pantalla pensada para tenerla abierta todo el día, y cada cambio se sincroniza en ambos sentidos: lo que editas en Vekipper aparece en Google, y al revés.",
      },
      architecture: [
        { name: "Web app", detail: { en: "TypeScript frontend, deployed on Vercel", es: "Frontend en TypeScript, desplegado en Vercel" } },
        { name: "API", detail: { en: "FastAPI service, containerized with Docker", es: "Servicio en FastAPI, en contenedores Docker" } },
        { name: "Data", detail: { en: "Supabase (PostgreSQL + auth)", es: "Supabase (PostgreSQL + auth)" } },
        { name: "Google APIs", detail: { en: "Calendar, Tasks and Gmail, two-way sync", es: "Calendar, Tasks y Gmail, sincronización en ambos sentidos" } },
        { name: "AI agent", detail: { en: "Integrated agent built on opencode", es: "Agente integrado construido sobre opencode" } },
      ],
      // decisions: [...]  → how sync works, conflict handling, the AI agent
      // results:   [...]  → users (live), daily active, events synced, uptime
      // lessons:   {...}
    },
  },
  {
    slug: "zpenz",
    title: "zpenz",
    summary: {
      en: "A web app to track income and expenses.",
      es: "Aplicación web para registrar ingresos y gastos.",
    },
    stack: [],
    caseStudy: {},
  },
  {
    slug: "wayuunext",
    title: "wayuunext",
    summary: {
      en: "A website to help people learn Wayuunaiki, the language of the Wayuu people.",
      es: "Sitio web para fomentar el aprendizaje del wayuunaiki, la lengua del pueblo wayuu.",
    },
    stack: [],
    caseStudy: {},
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
