"use client";

import { useChat } from "@ai-sdk/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { profile } from "../data/profile";
import { projects } from "../data/projects";
import { localePath, type Locale } from "../lib/i18n";

const copy = {
  en: {
    title: "ask-morgan",
    online: "online",
    session: "session started",
    intro: "Ask me anything about Morgan: projects, stack, way of working, availability.",
    scope: "I only answer questions about Morgan.",
    you: "you",
    bot: "morgan.ai",
    thinking: "thinking",
    placeholder: "type a question…",
    hintSend: "send",
    hintStop: "stop",
    hintPick: "pick",
    suggestions: ["What is Vekipper?", "What's Morgan's stack?", "Is Morgan open to remote roles?"],
    sys: "sys",
    helpHint: "type /help to see commands",
    cmds: {
      help: "show this list",
      email: "copy Morgan's email",
      links: "GitHub, LinkedIn and X",
      projects: "projects and their case studies",
      clear: "clear the conversation",
    },
    copied: "copied to clipboard ✓",
    copyFailed: "couldn't copy it, select it by hand",
    unknown: (c: string) => `unknown command: ${c}. type /help`,
    errors: {
      rate: `rate limit reached. try again in a few minutes, or email ${profile.email}`,
      generic: "connection lost. try again in a moment.",
    },
  },
  es: {
    title: "pregunta-a-morgan",
    online: "en línea",
    session: "sesión iniciada",
    intro: "Pregúntame lo que quieras sobre Morgan: proyectos, stack, forma de trabajar, disponibilidad.",
    scope: "Solo respondo preguntas sobre Morgan.",
    you: "tú",
    bot: "morgan.ai",
    thinking: "pensando",
    placeholder: "escribe una pregunta…",
    hintSend: "enviar",
    hintStop: "detener",
    hintPick: "elegir",
    suggestions: ["¿Qué es Vekipper?", "¿Qué stack usa Morgan?", "¿Morgan busca trabajo remoto?"],
    sys: "sys",
    helpHint: "escribe /help para ver los comandos",
    cmds: {
      help: "muestra esta lista",
      email: "copia el correo de Morgan",
      links: "GitHub, LinkedIn y X",
      projects: "proyectos y sus case studies",
      clear: "limpia la conversación",
    },
    copied: "copiado al portapapeles ✓",
    copyFailed: "no se pudo copiar, selecciónalo a mano",
    unknown: (c: string) => `comando desconocido: ${c}. escribe /help`,
    errors: {
      rate: `límite alcanzado. intenta en unos minutos o escribe a ${profile.email}`,
      generic: "se perdió la conexión. intenta de nuevo en un momento.",
    },
  },
};

const MAX_CHARS = 600;
const COMMANDS = ["help", "email", "links", "projects"] as const;
type Command = (typeof COMMANDS)[number];

// Output of a slash command. Rendered in the transcript, never sent to the model.
// `at` is how many chat messages existed when it ran, so it sorts in between them.
type LocalEntry = {
  id: number;
  at: number;
  input: string;
  cmd: Command | null;
  copied?: boolean;
};
const SPINNER = "⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏";

export default function AboutChat({ lang }: { lang: Locale }) {
  const t = copy[lang];
  const [input, setInput] = useState("");
  const [startedAt, setStartedAt] = useState("");
  const { messages, setMessages, sendMessage, status, stop, error, clearError } = useChat();
  const [local, setLocal] = useState<LocalEntry[]>([]);
  const history = useRef<string[]>([]);
  const historyPos = useRef(-1); // -1 = not browsing history
  const nextId = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const busy = status === "submitted" || status === "streaming";

  // Client-only, so server and browser render the same markup.
  useEffect(() => {
    setStartedAt(
      new Date().toLocaleTimeString(lang, { hour: "2-digit", minute: "2-digit", hour12: false }),
    );
  }, [lang]);

  // Keep the newest line in view while it streams in.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, status, local]);

  const runCommand = (raw: string) => {
    const name = raw.slice(1).split(/\s+/)[0].toLowerCase();
    if (name === "clear") {
      if (busy) stop();
      setMessages([]);
      setLocal([]);
      if (error) clearError();
      return;
    }
    const cmd = (COMMANDS as readonly string[]).includes(name) ? (name as Command) : null;
    const id = nextId.current++;
    setLocal((l) => [...l, { id, at: messages.length, input: raw, cmd }]);
    if (cmd === "email") {
      navigator.clipboard
        ?.writeText(profile.email)
        .then(
          () => true,
          () => false,
        )
        .then((ok) => setLocal((l) => l.map((e) => (e.id === id ? { ...e, copied: ok } : e))));
    }
  };

  const ask = (text: string) => {
    const q = text.trim().slice(0, MAX_CHARS);
    if (!q) return;
    if (q.startsWith("/")) {
      runCommand(q);
    } else {
      if (busy) return;
      if (error) clearError();
      sendMessage({ text: q });
    }
    if (history.current.at(-1) !== q) history.current.push(q);
    historyPos.current = -1;
    setInput("");
    inputRef.current?.focus();
  };

  const browseHistory = (dir: -1 | 1) => {
    const h = history.current;
    if (h.length === 0) return;
    let pos = historyPos.current === -1 ? h.length : historyPos.current;
    pos += dir;
    if (pos < 0) pos = 0;
    if (pos >= h.length) {
      historyPos.current = -1;
      setInput("");
      return;
    }
    historyPos.current = pos;
    setInput(h[pos]);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape" && busy) {
      e.preventDefault();
      stop();
    } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      browseHistory(e.key === "ArrowUp" ? -1 : 1);
    } else if (!input && messages.length === 0 && /^[1-3]$/.test(e.key)) {
      e.preventDefault();
      ask(t.suggestions[Number(e.key) - 1]);
    }
  };

  const errorText = error
    ? error.message.includes("rate_limited")
      ? t.errors.rate
      : t.errors.generic
    : null;

  const last = messages[messages.length - 1];
  const streamingId = status === "streaming" && last?.role === "assistant" ? last.id : null;

  return (
    <section
      aria-label={t.title}
      className="terminal relative flex h-full w-full flex-col overflow-hidden rounded-xl border border-white/[0.08] font-mono text-[13px] leading-relaxed"
      onClick={(e) => {
        // Clicking anywhere in the window focuses the prompt, like a terminal.
        if ((e.target as HTMLElement).closest("button, a, input")) return;
        if (!window.getSelection()?.toString()) inputRef.current?.focus();
      }}
    >
      {/* Title bar */}
      <header className="flex items-center justify-between gap-3 border-b border-white/[0.06] px-4 py-2.5 text-[11px] uppercase tracking-[0.14em] text-muted">
        <span className="flex items-center gap-2">
          <span aria-hidden className="text-foreground/30">
            ◆
          </span>
          {t.title}
        </span>
        <span className="flex items-center gap-2">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400/70 motion-reduce:hidden" />
            <span className="relative inline-flex size-1.5 rounded-full bg-emerald-400" />
          </span>
          {t.online}
        </span>
      </header>

      {/* Transcript */}
      <div ref={scrollRef} role="log" aria-live="polite" className="relative flex-1 overflow-y-auto px-4 py-5">
        <Rule label={startedAt ? `${t.session} · ${startedAt}` : t.session} />

        <Line who={t.bot} accent>
          {t.intro}
          <span className="mt-1 block text-muted">{t.scope}</span>
          <span className="block text-muted">{t.helpHint}</span>
        </Line>

        {messages.length === 0 && local.length === 0 && (
          <ol className="mt-4 space-y-1 pl-[5.5rem] max-sm:pl-0">
            {t.suggestions.map((s, i) => (
              <li key={s}>
                <button
                  type="button"
                  onClick={() => ask(s)}
                  className="group flex w-full items-baseline gap-3 rounded-md px-2 py-1 text-left text-foreground/70 transition-colors hover:bg-white/[0.04] hover:text-foreground"
                >
                  <span className="text-muted transition-colors group-hover:text-emerald-400">[{i + 1}]</span>
                  {s}
                </button>
              </li>
            ))}
          </ol>
        )}

        {[...messages.map((m, i) => ({ kind: "chat" as const, m, i })), ...local.map((e) => ({ kind: "local" as const, e }))]
          .sort((a, b) => (a.kind === "chat" ? a.i + 0.5 : a.e.at) - (b.kind === "chat" ? b.i + 0.5 : b.e.at))
          .map((item) => {
            if (item.kind === "local") {
              const { e } = item;
              return (
                <div key={`l${e.id}`}>
                  <Line who={t.you} muted>
                    {e.input}
                  </Line>
                  <Line who={t.sys}>
                    <CommandOutput entry={e} lang={lang} />
                  </Line>
                </div>
              );
            }
            const { m } = item;
            const text = m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
            if (!text) return null;
            const user = m.role === "user";
            return (
              <Line key={m.id} who={user ? t.you : t.bot} accent={!user} muted={user}>
                {text}
                {m.id === streamingId && <Caret />}
              </Line>
            );
          })}

        {status === "submitted" && (
          <Line who={t.bot} accent>
            <Spinner /> <span className="text-muted">{t.thinking}…</span>
          </Line>
        )}

        {errorText && (
          <p className="mt-4 text-red-400/90">
            <span aria-hidden>! </span>
            {errorText}
          </p>
        )}
      </div>

      {/* Prompt */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
        className="flex items-center gap-3 border-t border-white/[0.06] px-4 py-3"
      >
        <span aria-hidden className={busy ? "text-muted" : "text-emerald-400"}>
          ›
        </span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.currentTarget.value)}
          onKeyDown={onKeyDown}
          placeholder={t.placeholder}
          maxLength={MAX_CHARS}
          aria-label={t.placeholder}
          autoComplete="off"
          spellCheck={false}
          className="min-w-0 flex-1 bg-transparent text-foreground caret-emerald-400 placeholder:text-foreground/25 focus:outline-none"
        />
        {busy ? (
          <button
            type="button"
            onClick={() => stop()}
            className="rounded border border-white/10 px-2 py-0.5 text-[11px] uppercase tracking-wider text-muted transition-colors hover:border-white/20 hover:text-foreground"
          >
            esc
          </button>
        ) : (
          <button
            type="submit"
            disabled={!input.trim()}
            aria-label={t.hintSend}
            className="rounded border border-white/10 px-2 py-0.5 text-[11px] text-muted transition-colors enabled:hover:border-emerald-400/40 enabled:hover:text-emerald-400 disabled:opacity-30"
          >
            ↵
          </button>
        )}
      </form>

      {/* Status bar */}
      <footer className="flex items-center justify-between gap-3 border-t border-white/[0.06] bg-white/[0.015] px-4 py-1.5 text-[10px] uppercase tracking-[0.14em] text-foreground/30">
        <span className="flex gap-3">
          <span>↵ {t.hintSend}</span>
          <span>esc {t.hintStop}</span>
          <span className="max-sm:hidden">/help</span>
          {messages.length === 0 && local.length === 0 && <span className="max-sm:hidden">1–3 {t.hintPick}</span>}
        </span>
        <span className="truncate">claude-haiku-5.5</span>
      </footer>
    </section>
  );
}

function Line({
  who,
  accent,
  muted,
  children,
}: {
  who: string;
  accent?: boolean;
  muted?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-4 flex gap-3 max-sm:flex-col max-sm:gap-0.5">
      <span
        className={`w-[4.75rem] shrink-0 text-right text-[11px] uppercase leading-[1.9] tracking-[0.12em] max-sm:text-left ${
          accent ? "text-emerald-400/80" : "text-muted"
        }`}
      >
        {who}
      </span>
      <p className={`min-w-0 flex-1 whitespace-pre-wrap break-words ${muted ? "text-foreground/60" : "text-foreground/90"}`}>
        {children}
      </p>
    </div>
  );
}

const linkClass = "text-emerald-400/90 underline decoration-emerald-400/30 underline-offset-2 hover:decoration-emerald-400";

function CommandOutput({ entry, lang }: { entry: LocalEntry; lang: Locale }) {
  const t = copy[lang];
  switch (entry.cmd) {
    case "help":
      return (
        <>
          {[...COMMANDS, "clear" as const].map((c) => (
            <span key={c} className="block">
              <span className="inline-block w-24 text-foreground">/{c}</span>
              <span className="text-muted">{t.cmds[c]}</span>
            </span>
          ))}
        </>
      );
    case "email":
      return (
        <>
          <a href={`mailto:${profile.email}`} className={linkClass}>
            {profile.email}
          </a>
          {entry.copied !== undefined && (
            <span className="block text-muted">{entry.copied ? t.copied : t.copyFailed}</span>
          )}
        </>
      );
    case "links":
      return (
        <>
          {Object.entries(profile.links).map(([name, url]) => (
            <span key={name} className="block">
              <span className="inline-block w-24 text-muted">{name}</span>
              <a href={url} target="_blank" rel="noopener noreferrer" className={linkClass}>
                {url.replace(/^https:\/\/(www\.)?/, "")}
              </a>
            </span>
          ))}
        </>
      );
    case "projects":
      return (
        <>
          {projects.map((p) => (
            <span key={p.slug} className="block">
              <Link href={localePath(lang, `/work/${p.slug}`)} className={linkClass}>
                {p.title}
              </Link>
              <span className="text-muted"> · {p.summary[lang]}</span>
            </span>
          ))}
        </>
      );
    default:
      return <span className="text-red-400/90">{t.unknown(entry.input.split(/\s+/)[0])}</span>;
  }
}

function Rule({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.18em] text-foreground/25">
      <span className="h-px flex-1 bg-white/[0.06]" />
      {label}
      <span className="h-px flex-1 bg-white/[0.06]" />
    </div>
  );
}

function Caret() {
  return (
    <span
      aria-hidden
      className="ml-0.5 inline-block h-[1.05em] w-[0.55em] translate-y-[0.18em] animate-[blink_1s_steps(1)_infinite] bg-emerald-400/80 motion-reduce:animate-none"
    />
  );
}

function Spinner() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % SPINNER.length), 80);
    return () => clearInterval(id);
  }, []);
  return (
    <span aria-hidden className="text-emerald-400">
      {SPINNER[i]}
    </span>
  );
}
