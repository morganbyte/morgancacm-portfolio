import type { Metadata } from "next";
import Link from "next/link";
import { profile } from "./data/profile";

export const metadata: Metadata = { title: `404 | ${profile.name}` };

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-6 pt-24">
      <header className="mb-12">
        <p className="mb-2 text-xs tracking-wider text-muted">404</p>
        <h1 className="text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
          This page doesn&apos;t exist.
        </h1>
      </header>
      <Link
        href="/"
        className="group inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-foreground"
      >
        Back home
        <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
          →
        </span>
      </Link>
    </div>
  );
}
