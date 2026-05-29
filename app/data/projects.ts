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
    title: "zpenz",
    year: "In Progress / 2026",
    description:
      "AI-powered web software designed to improve the tracking and management of biweekly expenses. It offers a user-friendly interface for monitoring spending habits, setting financial goals, and making informed decisions about money management.",
    stack: ["Tailwind", "Vercel", "React", "TypeScript", "Supabase", "FastAPI"],
    live: "https://zpenz.vercel.app",
    source: "https://github.com/morganbyte/zpenz",
  },
];
