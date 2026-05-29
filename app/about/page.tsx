import type { Metadata } from "next";
import About from "../components/About";

export const metadata: Metadata = {
  title: "About | Andrés Morgan's Portfolio",
  description:
    "About Andrés Morgan — a software developer from Colombia building backend systems with Django, TypeScript, PostgreSQL and n8n.",
};

export default function AboutPage() {
  return (
    <>
      <header className="mb-12">
        <p className="mb-2 font-mono text-xs tracking-wider text-muted">
          About
        </p>
        <h1 className="text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
          I turn my product ideas into functional software systems
        </h1>
      </header>
      <About />
    </>
  );
}
