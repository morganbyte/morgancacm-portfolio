import type { Locale } from "../lib/i18n";
import Placeholder from "./Placeholder";

export const aboutCopy = {
  en: {
    bio: [
      "I'm a software developer from Colombia. I like taking a fuzzy product idea and turning it into a system that actually works in production.",
      "Most of my work is on the backend: designing data models, integrating services, and choosing the right amount of complexity for each problem instead of defaulting to whatever stack is trending.",
      "Right now I'm the founder and only developer of Vekipper, which I build in public. Outside of code I read about AI agents, watch soccer, and tinker with Linux.",
    ],
    howHeading: "How I work",
    how: [
      { title: "Writing first", body: "I document decisions, write clear PRs and keep async updates short. Remote teams run on writing, and it's where I do my best communication." },
      { title: "Own it end to end", body: "From the data model to deployment and the support inbox. If it breaks in production, it's mine to fix." },
      { title: "AI as a multiplier", body: "I ship AI features inside products and use coding agents daily, with review and tests keeping the quality bar where it should be." },
    ],
    todo: "Optional: experience / timeline, open-source contributions, things you've written.",
  },
  es: {
    bio: [
      "Soy desarrollador de software de Colombia. Me gusta tomar una idea de producto difusa y convertirla en un sistema que funcione de verdad en producción.",
      "La mayor parte de mi trabajo está en el backend: diseñar modelos de datos, integrar servicios y elegir la complejidad justa para cada problema, en lugar de irme por defecto con el stack de moda.",
      "Hoy soy fundador y único desarrollador de Vekipper, que construyo en público. Fuera del código leo sobre agentes de IA, veo fútbol y cacharreo con Linux.",
    ],
    howHeading: "Cómo trabajo",
    how: [
      { title: "Primero por escrito", body: "Documento decisiones, escribo PRs claros y mantengo actualizaciones asíncronas cortas. Los equipos remotos funcionan por escrito, y ahí es donde mejor me comunico." },
      { title: "De principio a fin", body: "Del modelo de datos al despliegue y al buzón de soporte. Si algo se rompe en producción, me toca arreglarlo." },
      { title: "IA como multiplicador", body: "Integro funciones de IA en productos y uso agentes de código a diario, con revisión y tests para mantener la calidad donde debe estar." },
    ],
    todo: "Opcional: experiencia / línea de tiempo, contribuciones open source, cosas que hayas escrito.",
  },
};

export default function About({ lang }: { lang: Locale }) {
  const t = aboutCopy[lang];

  return (
    <section className="mb-20">
      <div className="max-w-prose space-y-4 leading-relaxed text-foreground/80">
        {t.bio.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>

      <h2 className="mb-5 mt-14 text-base font-medium text-foreground">{t.howHeading}</h2>
      <div className="space-y-5">
        {t.how.map((item) => (
          <div key={item.title}>
            <h3 className="font-medium text-foreground">{item.title}</h3>
            <p className="mt-1 max-w-prose leading-relaxed text-foreground/75">{item.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <Placeholder>{t.todo}</Placeholder>
      </div>
    </section>
  );
}
