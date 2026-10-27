import type { Localized } from "../lib/i18n";

export type Project = {
  title: string;
  year: Localized;
  inProgress: boolean;
  description: Localized;
  highlight?: Localized;
  stack: string[];
  live: string;
  source: string;
};

export const projects: Project[] = [
  {
    title: "Vekipper",
    year: { es: "En desarrollo · 2026", en: "In Progress · 2026" },
    inProgress: true,
    description: {
      es: "Centro de mando personal en la web que reúne Google Calendar, Google Tasks y Gmail en una sola pantalla, pensado para tenerlo abierto todo el día. La sincronización va en ambos sentidos: lo que cambias en Vekipper aparece en Google, y al revés.",
      en: "Personal web command center that brings Google Calendar, Google Tasks and Gmail together on a single screen, built to stay open all day. Changes sync both ways, so anything edited in Vekipper shows up in Google and vice versa.",
    },
    stack: ["Next.js", "TypeScript", "Tailwind", "shadcn/ui", "FastAPI", "Supabase", "Vercel"],
    live: "https://vekipper.vercel.app",
    source: "https://github.com/morganbyte/vekipper",
  },
  {
    title: "zpenz",
    year: { es: "En desarrollo · 2026", en: "In Progress · 2026" },
    inProgress: true,
    description: {
      es: "Software web con IA para llevar el control y la gestión de los gastos quincenales. Ofrece una interfaz sencilla para seguir tus hábitos de gasto, fijar metas financieras y tomar decisiones informadas sobre tu dinero.",
      en: "AI-powered web software designed to improve the tracking and management of biweekly expenses. It offers a user-friendly interface for monitoring spending habits, setting financial goals, and making informed decisions about money management.",
    },
    highlight: { es: "Llegó a 4 usuarios reales", en: "Reached 4 real users" },
    stack: ["Tailwind", "Vercel", "React", "TypeScript", "Supabase", "FastAPI"],
    live: "https://zpenz.vercel.app",
    source: "https://github.com/morganbyte/zpenz",
  },
  {
    title: "zpenz API",
    year: { es: "2026", en: "2026" },
    inProgress: false,
    description: {
      es: "API REST detrás de zpenz. Gestiona cuentas, categorías de ingresos y gastos, y transacciones con resúmenes por mes y por categoría; usa autenticación JWT de Supabase y corre serverless en Vercel.",
      en: "REST API behind zpenz, a personal finance app. Handles accounts, income and expense categories, and transactions with summaries by month and category, secured with Supabase JWT authentication and deployed serverless on Vercel.",
    },
    stack: ["Python", "FastAPI", "SQLAlchemy", "PostgreSQL", "Supabase", "Pytest", "Vercel"],
    live: "https://zpenz-api.vercel.app/docs",
    source: "https://github.com/morganbyte/zpenz-api",
  },
];
