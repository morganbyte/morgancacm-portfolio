import Image from "next/image";
import type { ReactNode } from "react";
import type { Locale } from "../lib/i18n";

type Building = {
  name: string;
  href: string;
  logo?: ReactNode;
};

const building: Building[] = [
  { name: "Vekipper", href: "https://vekipper.vercel.app" },
];

const copy = {
  es: {
    role: "Desarrollador de software | Fundador de",
    and: " y ",
    bio: [
      "Soy desarrollador de software y paso mi tiempo construyendo prácticamente cualquier cosa que se me ocurra y pueda hacer realidad. Hoy trabajo de lleno en Vekipper, mi proyecto estrella: un centro de mando personal en la web que reúne el calendario, las tareas y los correos que importan en una sola pantalla, para tenerla abierta todo el día.",
      "Mi principal interés es el backend, en concreto diseñar el sistema óptimo para cada solución que desarrollo. Me interesan mucho los microservicios, pero solo cuando de verdad son necesarios; si no, creo que una arquitectura monolítica suele bastar para resolver casi cualquier problema.",
    ],
  },
  en: {
    role: "Software developer | Founder of",
    and: " and ",
    bio: [
      "I’m a software developer who spends my time building basically anything I can think of and bring to life. Right now I’m working full-time on Vekipper, my flagship project: a personal web command center that brings your calendar, tasks and the emails that matter together on a single screen, built to stay open all day.",
      "My main interest is the backend, specifically designing optimal systems for each solution I develop. I’m very interested in microservices—but only when they’re truly necessary; otherwise, I believe a monolithic architecture is usually sufficient to solve any given problem.",
    ],
  },
};

function joinBuilding(items: Building[], and: string) {
  const len = items.length;
  return items.map((item, i) => {
    let separator = "";
    if (i === len - 1) separator = ".";
    else if (i === len - 2) separator = len > 2 ? `,${and}` : and;
    else separator = ", ";

    const external = item.href.startsWith("http");

    return (
      <span key={item.name}>
        {item.logo && (
          <span className="mx-1 inline-flex size-4 -translate-y-px items-center justify-center align-middle text-foreground/80">
            {item.logo}
          </span>
        )}
        <a
          href={item.href}
          target={external ? "_blank" : undefined}
          rel={external ? "noreferrer" : undefined}
          className="text-foreground underline-offset-4 decoration-muted/60 hover:underline"
        >
          {item.name}
        </a>
        {separator}
      </span>
    );
  });
}

export default function Hero({ lang }: { lang: Locale }) {
  const t = copy[lang];

  return (
    <section className="mb-16">
      <div className="flex items-center gap-4">
        <Image
          src="/avatar.jpg"
          alt="morgancacm"
          width={112}
          height={112}
          priority
          className="size-12 shrink-0 rounded-full border border-border bg-subtle object-cover sm:size-14"
        />

        <div className="min-w-0">
          <h1 className="text-base font-medium tracking-tight text-foreground sm:text-lg">
            morgancacm
          </h1>
          <p className="text-sm leading-relaxed text-muted">
            {t.role} {joinBuilding(building, t.and)}
          </p>
        </div>
      </div>

      <div className="mt-10 max-w-prose space-y-4 leading-relaxed text-foreground/80">
        {t.bio.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}
