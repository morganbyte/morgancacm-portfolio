"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  localeFromPath,
  localePath,
  stripLocale,
  type Locale,
} from "../lib/i18n";
import { BriefcaseIcon, GlobeIcon, HomeIcon, UserIcon } from "./Icons";

const labels = {
  es: { home: "Inicio", about: "Sobre mí", work: "Proyectos", nav: "Navegación principal" },
  en: { home: "Home", about: "About", work: "Work", nav: "Main navigation" },
};

const switcher = {
  es: { target: "en" as Locale, short: "English", label: "Read in English" },
  en: { target: "es" as Locale, short: "Español", label: "Ver en español" },
};

// X-style navigation: a sticky left sidebar on tablet and desktop (icons only
// on md, icons + labels from xl), and a bottom tab bar on phones.
export default function Navbar() {
  const pathname = usePathname();
  const lang = localeFromPath(pathname);
  const path = stripLocale(pathname);
  const t = labels[lang];
  const sw = switcher[lang];

  const items = [
    { href: "/", label: t.home, Icon: HomeIcon },
    { href: "/about", label: t.about, Icon: UserIcon },
    { href: "/work", label: t.work, Icon: BriefcaseIcon },
  ];

  // Each language has its own root layout, so switching is a full page load.
  const langHref = localePath(sw.target, path);

  return (
    <>
      <header className="sticky top-0 hidden h-screen w-[88px] shrink-0 flex-col items-end self-start px-3 py-6 md:flex xl:w-64 xl:items-stretch">
        <nav aria-label={t.nav} className="flex-1">
          <ul className="flex flex-col items-end gap-1 xl:items-start">
            {items.map(({ href, label, Icon }) => {
              const active = path === href;
              return (
                <li key={href}>
                  <Link
                    href={localePath(lang, href)}
                    aria-label={label}
                    aria-current={active ? "page" : undefined}
                    title={label}
                    className={`flex items-center gap-4 rounded-full p-3 text-lg transition-colors hover:bg-subtle/50 xl:pr-6 ${
                      active ? "font-semibold text-foreground" : "text-foreground/70 hover:text-foreground"
                    }`}
                  >
                    <Icon className="size-6 shrink-0" />
                    <span className="hidden xl:inline">{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <a
          href={langHref}
          hrefLang={sw.target}
          lang={sw.target}
          aria-label={sw.label}
          title={sw.label}
          className="flex items-center gap-4 rounded-full p-3 text-foreground/70 transition-colors hover:bg-subtle/50 hover:text-foreground xl:self-start xl:pr-6"
        >
          <GlobeIcon className="size-6 shrink-0" />
          <span className="hidden xl:inline">{sw.short}</span>
        </a>
      </header>

      <nav
        aria-label={t.nav}
        className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/80 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden"
      >
        <ul className="flex items-center justify-around">
          {items.map(({ href, label, Icon }) => {
            const active = path === href;
            return (
              <li key={href}>
                <Link
                  href={localePath(lang, href)}
                  aria-label={label}
                  aria-current={active ? "page" : undefined}
                  className={`flex size-14 items-center justify-center ${
                    active ? "text-foreground" : "text-muted"
                  }`}
                >
                  <Icon className="size-6" />
                </Link>
              </li>
            );
          })}
          <li>
            <a
              href={langHref}
              hrefLang={sw.target}
              lang={sw.target}
              aria-label={sw.label}
              className="flex size-14 items-center justify-center text-muted"
            >
              <GlobeIcon className="size-6" />
            </a>
          </li>
        </ul>
      </nav>
    </>
  );
}
