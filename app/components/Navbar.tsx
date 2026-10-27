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
  es: { home: "Inicio", about: "Sobre mí", work: "Proyectos" },
  en: { home: "Home", about: "About", work: "Work" },
};

const switcher = {
  es: { target: "en" as Locale, short: "EN", label: "Read in English" },
  en: { target: "es" as Locale, short: "ES", label: "Ver en español" },
};

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

  return (
    <nav className="fixed top-6 left-1/2 z-50 -translate-x-1/2">
      <ul className="flex items-center gap-1 rounded-full border border-border bg-background/70 px-1.5 py-1.5 shadow-xl shadow-black/40 backdrop-blur-xl">
        {items.map(({ href, label, Icon }) => {
          const active = path === href;
          return (
            <li key={href}>
              <Link
                href={localePath(lang, href)}
                aria-label={label}
                aria-current={active ? "page" : undefined}
                className={`group flex items-center gap-2 rounded-full px-3 py-2 transition-colors ${
                  active
                    ? "bg-subtle text-foreground"
                    : "text-muted hover:bg-subtle/50 hover:text-foreground"
                }`}
              >
                <Icon className="size-4" />
                <span
                  className={`whitespace-nowrap font-mono text-xs ${
                    active ? "inline" : "hidden sm:inline"
                  }`}
                >
                  {label}
                </span>
              </Link>
            </li>
          );
        })}

        <li aria-hidden className="mx-0.5 h-5 w-px bg-border" />

        <li>
          {/* Each language has its own root layout, so this is a full page load. */}
          <a
            href={localePath(sw.target, path)}
            hrefLang={sw.target}
            lang={sw.target}
            aria-label={sw.label}
            title={sw.label}
            className="flex items-center gap-1.5 rounded-full px-3 py-2 text-muted transition-colors hover:bg-subtle/50 hover:text-foreground"
          >
            <GlobeIcon className="size-4" />
            <span className="font-mono text-xs">{sw.short}</span>
          </a>
        </li>
      </ul>
    </nav>
  );
}
