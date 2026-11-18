import type { Localized } from "../lib/i18n";

// Everything about you that appears across the site, in one place.
export const profile = {
  name: "Morgan",
  handle: "morgancacm",

  role: {
    en: "Full-stack developer, backend-focused",
    es: "Desarrollador full-stack con foco en backend",
  } satisfies Localized,

  // The one sentence a recruiter should remember.
  tagline: {
    en: "I build and run real products with AI built in, from the data model to the interface.",
    es: "Construyo y opero productos reales con IA integrada, del modelo de datos a la interfaz.",
  } satisfies Localized,

  availability: {
    en: "Open to remote roles · Colombia, UTC-5",
    es: "Disponible para trabajo remoto · Colombia, UTC-5",
  } satisfies Localized,

  email: "morgancacm@gmail.com",

  /** Path to the CV PDF in /public (e.g. "/cv-morgan.pdf"). null hides the button. */
  cv: null as string | null,

  links: {
    github: "https://github.com/morganbyte",
    linkedin: "https://www.linkedin.com/in/morgancacm/",
    x: "https://x.com/morgancacm",
  },

  // One line, no logos. Order = what you want to be hired for.
  stack: [
    "TypeScript",
    "Python",
    "FastAPI",
    "PostgreSQL",
    "Supabase",
    "Docker",
    "Vercel",
    "LLM integration",
    "n8n",
  ],
};
