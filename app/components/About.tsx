import Placeholder from "./Placeholder";

export const aboutCopy = {
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
};

export default function About() {
  const t = aboutCopy;

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
