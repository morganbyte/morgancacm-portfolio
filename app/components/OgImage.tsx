import { ImageResponse } from "next/og";
import { profile } from "../data/profile";

export const ogSize = { width: 1200, height: 630 };

export const ogAlt = `${profile.name} | ${profile.role}`;

export function ogImage() {
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
            {profile.tagline}
          </div>
          <div
            style={{
              fontSize: 28,
              color: "#a3a3a3",
            }}
          >
            {ogAlt}
          </div>
        </div>
      </div>
    ),
    { ...ogSize }
  );
}
