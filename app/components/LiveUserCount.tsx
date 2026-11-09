"use client";

import { useEffect, useState } from "react";
import type { Locale } from "../lib/i18n";
import { UsersIcon } from "./Icons";

const POLL_MS = 30_000;

const copy = {
  es: { one: "usuario real", many: "usuarios reales", live: "En vivo" },
  en: { one: "real user", many: "real users", live: "Live" },
};

// Vekipper's real user count, refreshed every 30 s while the tab is visible.
// Renders nothing until a number arrives, or if the stats endpoint is down.
export default function LiveUserCount({ lang }: { lang: Locale }) {
  const [users, setUsers] = useState<number | null>(null);
  const t = copy[lang];

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    async function load() {
      try {
        const res = await fetch("/api/vekipper-users", { cache: "no-store" });
        const data = (await res.json()) as { users: number | null };
        if (!cancelled && typeof data.users === "number") setUsers(data.users);
      } catch {
        // Keep the last known number.
      }
      if (!cancelled && document.visibilityState === "visible") {
        timer = setTimeout(load, POLL_MS);
      }
    }

    function onVisibility() {
      clearTimeout(timer);
      if (document.visibilityState === "visible") load();
    }

    load();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelled = true;
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  if (users === null) return null;

  return (
    <p className="inline-flex items-center gap-1.5 text-xs text-foreground/80" aria-live="polite">
      <UsersIcon className="size-3.5 text-muted" />
      <span className="tabular-nums">{users.toLocaleString(lang)}</span>{" "}
      {users === 1 ? t.one : t.many}
      <span className="ml-1 inline-flex items-center gap-1 text-muted" title={t.live}>
        <span className="relative flex size-1.5">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75 motion-reduce:hidden" />
          <span className="relative inline-flex size-1.5 rounded-full bg-emerald-400" />
        </span>
        <span className="sr-only">{t.live}</span>
      </span>
    </p>
  );
}
