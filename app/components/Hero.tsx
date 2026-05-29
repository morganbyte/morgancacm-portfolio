import Image from "next/image";
import type { ReactNode } from "react";

type Building = {
  name: string;
  href: string;
  logo?: ReactNode;
};

const building: Building[] = [
  { name: "zpenz", href: "https://zpenz.vercel.app" },
];

function joinBuilding(items: Building[]) {
  const len = items.length;
  return items.map((item, i) => {
    let separator = "";
    if (i === len - 1) separator = ".";
    else if (i === len - 2) separator = len > 2 ? ", and " : " and ";
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

export default function Hero() {
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
            Software developer | Founder {joinBuilding(building)}
          </p>
        </div>
      </div>

      <div className="mt-10 max-w-prose space-y-4 leading-relaxed text-foreground/80">
        <p>
          I’m a software developer who spends my time building basically anything I can think of and bring to life. I’m currently building zpenz: a website for managing biweekly finances through a system of automated tips and decisions.
        </p>
        <p>
          My main interest is the backend, specifically designing optimal systems for each solution I develop. I’m very interested in microservices—but only when they’re truly necessary; otherwise, I believe a monolithic architecture is usually sufficient to solve any given problem.
        </p>
      </div>
    </section>
  );
}
