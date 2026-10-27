import type { Locale } from "../lib/i18n";

const linkClass =
  "text-foreground underline-offset-4 decoration-muted/60 hover:underline";

const copy = {
  es: {
    bio: [
      "Soy desarrollador de software de Colombia y disfruto tomar una idea de producto difusa y convertirla en un sistema que funcione de verdad en producción.",
      "La mayor parte de mi trabajo se centra en el backend: diseñar modelos de datos, integrar servicios y elegir el nivel de complejidad adecuado para cada problema, en lugar de irme por defecto con el stack de moda.",
      "Últimamente reparto mi tiempo entre Django y TypeScript, con PostgreSQL haciendo el trabajo pesado en los datos y n8n conectando las automatizaciones que mantienen todo funcionando. Fuera del código, suelo leer sobre lo último en agentes de IA, ver fútbol o aprender más sobre sistemas operativos como Linux.",
    ],
    currently: "Ahora mismo",
    open: "Estoy abierto a roles de desarrollador web junior, prácticas preprofesionales y colaboraciones de producto bien acotadas, donde importen tanto la interfaz como la lógica del producto. Puedes escribirme por",
    via: ", por",
    email: "correo",
    code: "o ver mi código en",
  },
  en: {
    bio: [
      "I'm a software developer from Colombia who enjoys taking a vague product idea and turning it into a system that actually works in production.",
      "Most of my work focuses on the backend: designing data models, integrating services, and choosing the right level of complexity for each problem, rather than defaulting to the trendiest tech stack.",
      "Lately, I've been splitting my time between Django and TypeScript, with PostgreSQL handling the heavy lifting on the data side and n8n connecting the automations that keep everything running. Aside from coding, I usually read up on the latest developments in AI agents, watch soccer, or learn more about operating systems like Linux.",
    ],
    currently: "Currently",
    open: "I'm open to junior web developer roles, pre-professional internships, and carefully scoped product collaborations where the interface and the product logic both matter. You can reach me on",
    via: ", via",
    email: "email",
    code: "or see my code on",
  },
};

export default function About({ lang }: { lang: Locale }) {
  const t = copy[lang];

  return (
    <section className="mb-20">
      <div className="space-y-4 leading-relaxed text-foreground/80">
        {t.bio.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <div className="mt-10">
        <h2 className="mb-3 font-mono text-xs tracking-wider text-muted">
          {t.currently}
        </h2>
        <p className="leading-relaxed text-foreground/80">
          {t.open}{" "}
          <a
            href="https://www.linkedin.com/in/morgancacm/"
            target="_blank"
            rel="noreferrer"
            className={linkClass}
          >
            LinkedIn
          </a>
          {t.via}{" "}
          <a href="mailto:morgancacm@gmail.com" className={linkClass}>
            {t.email}
          </a>
          , {t.code}{" "}
          <a
            href="https://github.com/morganbyte"
            target="_blank"
            rel="noreferrer"
            className={linkClass}
          >
            GitHub
          </a>
          .
        </p>
      </div>
    </section>
  );
}
