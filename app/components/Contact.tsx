import { profile } from "../data/profile";

const copy = {
  heading: "Get in touch",
  body: "I'm looking for remote, full-time roles on product teams, backend or full-stack. The fastest way to reach me is email; I reply within a day.",
};

export default function Contact() {
  const t = copy;
  return (
    <section className="mb-8">
      <h2 className="mb-3 text-base font-medium text-foreground">{t.heading}</h2>
      <p className="max-w-prose leading-relaxed text-foreground/75">{t.body}</p>
      <a
        href={`mailto:${profile.email}`}
        className="mt-4 inline-block text-lg font-medium text-foreground underline decoration-muted/60 underline-offset-4 hover:decoration-foreground"
      >
        {profile.email}
      </a>
    </section>
  );
}
