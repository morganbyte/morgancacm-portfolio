// Everything about you that appears across the site, in one place.
export const profile = {
  name: "Morgan",
  handle: "morgancacm",

  role: "Full-stack developer, backend-focused",

  // The one sentence a recruiter should remember.
  tagline: "I build and run real products with AI built in, from the data model to the interface.",

  availability: "Open to remote roles · Colombia, UTC-5",

  /** IANA zone for the live clock under the portrait. */
  timezone: "America/Bogota",

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
