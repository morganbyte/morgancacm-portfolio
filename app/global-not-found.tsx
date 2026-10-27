import type { Metadata } from "next";
import RootShell from "./components/RootShell";
import { SITE_URL } from "./lib/i18n";

export const metadata: Metadata = {
  title: "404 | Portafolio de Andrés Morgan",
  metadataBase: new URL(SITE_URL),
};

// With one root layout per language there is no shared layout for 404s,
// so unmatched URLs land here.
export default function GlobalNotFound() {
  return (
    <RootShell lang="es">
      <header className="mb-12">
        <p className="mb-2 font-mono text-xs tracking-wider text-muted">404</p>
        <h1 className="text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
          Esta página no existe.
        </h1>
        <p lang="en" className="mt-3 text-sm text-muted">
          This page doesn&apos;t exist.
        </p>
      </header>
      <a
        href="/"
        className="group inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-foreground"
      >
        Volver al inicio
        <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
          →
        </span>
      </a>
    </RootShell>
  );
}
