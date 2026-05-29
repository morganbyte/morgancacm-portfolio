export default function About() {
  return (
    <section className="mb-20">
      <div className="space-y-4 leading-relaxed text-foreground/80">
        <p>
          I&apos;m a software developer from Colombia who enjoys taking a vague product idea and turning it into a system that actually works in production.
        </p>
        <p>
          Most of my work focuses on the backend: designing data models, integrating services, and choosing the right level of complexity for each problem, rather than defaulting to the trendiest tech stack.
        </p>
        <p>
          Lately, I&apos;ve been splitting my time between Django and TypeScript, with PostgreSQL handling the heavy lifting on the data side and n8n connecting the automations that keep everything running. Aside from coding, I usually read up on the latest developments in AI agents, watch soccer, or learn more about operating systems like Linux.
        </p>
      </div>

      <div className="mt-10">
        <h2 className="mb-3 font-mono text-xs tracking-wider text-muted">
          Currently
        </h2>
        <p className="leading-relaxed text-foreground/80">
          I&apos;m open to junior web developer roles, pre-professional internships, and carefully scoped product collaborations where the interface and the product logic both matter. You can reach me on{" "}
          <a
            href="https://www.linkedin.com/in/morgancacm/"
            target="_blank"
            rel="noreferrer"
            className="text-foreground underline-offset-4 decoration-muted/60 hover:underline"
          >
            LinkedIn
          </a>
          , via{" "}
          <a
            href="mailto:morgancacm@gmail.com"
            className="text-foreground underline-offset-4 decoration-muted/60 hover:underline"
          >
            email
          </a>
          , or see my code on{" "}
          <a
            href="https://github.com/morganbyte"
            target="_blank"
            rel="noreferrer"
            className="text-foreground underline-offset-4 decoration-muted/60 hover:underline"
          >
            GitHub
          </a>
          .
        </p>
      </div>
    </section>
  );
}
