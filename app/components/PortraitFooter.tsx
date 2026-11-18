"use client";

import { useEffect, useState } from "react";
import { ditta } from "../data/ditta";
import { profile } from "../data/profile";
import { APP_ENV, isProduction } from "../lib/env";

const copy = { city: "Bogotá", credits: `designed & built by ${profile.name}` };

function clock() {
  return new Date().toLocaleTimeString("en-GB", {
    timeZone: profile.timezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

// One line under the portrait: Morgan's local time, ditta's version, credits.
export default function PortraitFooter() {
  const t = copy;
  // Client-only so server and browser render the same markup.
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => setTime(clock());
    tick();
    const id = setInterval(tick, 15_000);
    return () => clearInterval(id);
  }, []);

  return (
    <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 font-mono text-[11px] text-foreground/35">
      <span>
        {t.city} · UTC-5
        {time && <span className="tabular-nums text-foreground/60"> {time}</span>}
      </span>
      <span aria-hidden>·</span>
      <span>
        {ditta.name} v{ditta.version}
        {!isProduction && <span className="text-amber-400/80"> · {APP_ENV}</span>}
      </span>
      <span aria-hidden>·</span>
      <span>
        © {new Date().getFullYear()} {profile.name}, {t.credits}
      </span>
    </p>
  );
}
