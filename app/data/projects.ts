export type Project = {
  title: string;
  year: string;
  description: string;
  stack: string[];
  live: string;
  source: string;
};

export const projects: Project[] = [
  {
    title: "Vekipper",
    year: "In Progress / 2026",
    description:
      "Personal web command center that brings Google Calendar, Google Tasks and Gmail together on a single screen, built to stay open all day. Changes sync both ways, so anything edited in Vekipper shows up in Google and vice versa.",
    stack: ["Next.js", "TypeScript", "Tailwind", "shadcn/ui", "FastAPI", "Supabase", "Vercel"],
    live: "https://vekipper.vercel.app",
    source: "https://github.com/morganbyte/vekipper",
  },
  {
    title: "zpenz API",
    year: "2026",
    description:
      "REST API behind zpenz, a personal finance app. Handles accounts, income and expense categories, and transactions with summaries by month and category, secured with Supabase JWT authentication and deployed serverless on Vercel.",
    stack: ["Python", "FastAPI", "SQLAlchemy", "PostgreSQL", "Supabase", "Pytest", "Vercel"],
    live: "https://zpenz-api.vercel.app/docs",
    source: "https://github.com/morganbyte/zpenz-api",
  },
];
