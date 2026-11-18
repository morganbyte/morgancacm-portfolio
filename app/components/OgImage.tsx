import { ImageResponse } from "next/og";
import type { Locale } from "../lib/i18n";

import { profile } from "../data/profile";

const copy = {
  en: { alt: `${profile.name} | ${profile.role.en}` },
  es: { alt: `${profile.name} | ${profile.role.es}` },
};


export const ogSize = { width: 1200, height: 630 };

export function ogAlt(lang: Locale) {
  return copy[lang].alt;
}

export function ogImage(lang: Locale) {
  const t = copy[lang];
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0a0a",
          color: "#ededed",
          padding: 80,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 28,
            color: "#737373",
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          {profile.name}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          <div
            style={{
              fontSize: 64,
              fontWeight: 600,
              lineHeight: 1.05,
              letterSpacing: -1.5,
            }}
          >
            {profile.tagline[lang]}
          </div>
          <div
            style={{
              fontSize: 28,
              color: "#a3a3a3",
            }}
          >
            {t.alt}
          </div>
        </div>
      </div>
    ),
    { ...ogSize }
  );
}
