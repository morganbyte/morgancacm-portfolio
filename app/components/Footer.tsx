import {
  GithubIcon,
  LinkedinIcon,
  MailIcon,
  XIcon,
} from "./Icons";

const socials = [
  { label: "GitHub", href: "https://github.com/morganbyte", Icon: GithubIcon },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/morgancacm/",
    Icon: LinkedinIcon,
  },
  { label: "X", href: "https://x.com/morgancacm", Icon: XIcon },
  { label: "Email", href: "mailto:morgancacm@gmail.com", Icon: MailIcon },
];

export default function Footer() {
  return (
    <footer className="mt-24 w-full border-t border-border">
      <div className="mx-auto flex max-w-2xl flex-col items-start justify-between gap-6 px-6 py-8 sm:flex-row sm:items-center">
        <p className="font-mono text-sm">
          <span className="text-muted">© {new Date().getFullYear()}</span>{" "}
          <span className="font-medium tracking-tight text-foreground">
            morgancacm
          </span>
        </p>

        <ul className="flex items-center gap-2.5">
          {socials.map(({ label, href, Icon }) => {
            const external = !href.startsWith("mailto:");
            return (
              <li key={label}>
                <a
                  href={href}
                  aria-label={label}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noreferrer" : undefined}
                  className="flex size-11 items-center justify-center rounded-full border border-border bg-subtle/30 text-muted transition-all hover:-translate-y-0.5 hover:border-foreground/20 hover:bg-subtle/60 hover:text-foreground"
                >
                  <Icon className="size-[18px]" />
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </footer>
  );
}
