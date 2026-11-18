export const locales = ["en", "es"] as const;
export type Locale = (typeof locales)[number];
export type Localized = Record<Locale, string>;

export const SITE_URL = "https://morgancacm-portfolio.vercel.app";

// English lives at the root (international audience); Spanish is under /es.
export function localePath(locale: Locale, path: string) {
  if (locale === "en") return path;
  return path === "/" ? "/es" : `/es${path}`;
}

export function localeFromPath(pathname: string): Locale {
  return pathname === "/es" || pathname.startsWith("/es/") ? "es" : "en";
}

export function stripLocale(pathname: string) {
  if (localeFromPath(pathname) === "en") return pathname;
  return pathname.slice(3) || "/";
}

export function alternates(locale: Locale, path: string) {
  return {
    canonical: localePath(locale, path),
    languages: {
      en: localePath("en", path),
      es: localePath("es", path),
      "x-default": localePath("en", path),
    },
  };
}
