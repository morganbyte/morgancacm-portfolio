export const locales = ["es", "en"] as const;
export type Locale = (typeof locales)[number];
export type Localized = Record<Locale, string>;

export const SITE_URL = "https://morgancacm-portfolio.vercel.app";

// Spanish lives at the root; English is prefixed with /en.
export function localePath(locale: Locale, path: string) {
  if (locale === "es") return path;
  return path === "/" ? "/en" : `/en${path}`;
}

export function localeFromPath(pathname: string): Locale {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "es";
}

export function stripLocale(pathname: string) {
  if (localeFromPath(pathname) === "es") return pathname;
  return pathname.slice(3) || "/";
}

export function alternates(locale: Locale, path: string) {
  return {
    canonical: localePath(locale, path),
    languages: {
      es: localePath("es", path),
      en: localePath("en", path),
      "x-default": localePath("es", path),
    },
  };
}
