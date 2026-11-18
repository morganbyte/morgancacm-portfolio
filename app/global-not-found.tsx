import type { Metadata } from "next";
import RootShell from "./components/RootShell";
import { SITE_URL } from "./lib/i18n";

export const metadata: Metadata = {
  title: "404 | Morgan",
  metadataBase: new URL(SITE_URL),
};

// With one root layout per language there is no shared layout for 404s,
// so unmatched URLs land here.
export default function GlobalNotFound() {
  return (
    <RootShell lang="en">
      <div className="mx-auto max-w-2xl px-6 pt-24">
      <header className="mb-12">
        <p className="mb-2 text-xs tracking-wider text-muted">404</p>
        <h1 className="text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
          This page doesn&apos;t exist.
        </h1>
        <p lang="es" className="mt-3 text-sm text-muted">
          Esta página no existe.
        </p>
      </header>
      <a
        href="/"
        className="group inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-foreground"
      >
        Back home
        <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
          →
        </span>
      </a>
      </div>
    </RootShell>
  );
}
