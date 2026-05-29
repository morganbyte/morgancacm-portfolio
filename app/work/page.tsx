import type { Metadata } from "next";
import Projects from "../components/Projects";

export const metadata: Metadata = {
  title: "Work | Andrés Morgan's Portfolio",
  description:
    "Selected projects by Andrés Morgan — products and systems built end-to-end, from data model to interface.",
};

export default function WorkPage() {
  return (
    <>
      <header className="mb-12">
        <p className="mb-2 font-mono text-xs tracking-wider text-muted">
          Work
        </p>
        <h1 className="text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
          Selected work.
        </h1>
      </header>
      <Projects showHeader={false} />
    </>
  );
}
