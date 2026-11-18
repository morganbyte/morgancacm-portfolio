"use client";

import { useChat } from "@ai-sdk/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { profile } from "../data/profile";
import { projects } from "../data/projects";

const copy = {
  label: "chat with ditta",
  intro:
    "i'm morgan's AI. ask me anything about morgan's work, or let me set up a call or meeting with morgan.",
  thinking: "thinking",
  placeholder: "/help for commands",
  hints: { send: "send", stop: "stop", history: "history" },
  cmds: {
    help: "show this list",
    email: "copy Morgan's email",
    links: "GitHub, LinkedIn and X",
    projects: "projects and their case studies",
    clear: "clear the conversation",
  },
  copied: "copied to clipboard",
  copyFailed: "couldn't copy it, select it by hand",
  unknown: (c: string) => `unknown command: ${c} · try /help`,
  errors: {
    private: `ditta is in private beta for now. /help still works, or email ${profile.email}`,
    rate: `rate limit reached. try again in a few minutes, or email ${profile.email}`,
    generic: "connection lost. try again in a moment.",
  },
};

const MAX_CHARS = 600;
const SPINNER = "·✢✳✶✻✽✻✶✳✢";
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

export default function AboutChat() {
  const t = copy;
  const [input, setInput] = useState("");
  const {
    messages,
    setMessages,
    sendMessage,
    status,
    stop,
    error,
    clearError,
  } = useChat();
  const [local, setLocal] = useState<LocalEntry[]>([]);
  const history = useRef<string[]>([]);
  const historyPos = useRef(-1); // -1 = not browsing history
  const nextId = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const busy = status === "submitted" || status === "streaming";

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
    const cmd = (COMMANDS as readonly string[]).includes(name)
      ? (name as Command)
      : null;
    const id = nextId.current++;
    setLocal((l) => [...l, { id, at: messages.length, input: raw, cmd }]);
    if (cmd === "email") {
      navigator.clipboard
        ?.writeText(profile.email)
        .then(
          () => true,
          () => false,
        )
        .then((ok) =>
          setLocal((l) =>
            l.map((e) => (e.id === id ? { ...e, copied: ok } : e)),
          ),
        );
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
    }
  };

  const errorText = !error
    ? null
    : error.message.includes("ditta_private")
      ? t.errors.private
      : error.message.includes("rate_limited")
        ? t.errors.rate
        : t.errors.generic;

  const last = messages[messages.length - 1];
  const streamingId =
    status === "streaming" && last?.role === "assistant" ? last.id : null;

  const timeline = [
    ...messages.map((m, i) => ({ kind: "chat" as const, m, order: i + 0.5 })),
    ...local.map((e) => ({ kind: "local" as const, e, order: e.at })),
  ].sort((a, b) => a.order - b.order);

  return (
    <section
      aria-label={t.label}
      className="flex h-full w-full flex-col font-mono text-[13px] leading-[1.65] text-foreground/90"
      onClick={(e) => {
        // Clicking anywhere in the window focuses the prompt, like a terminal.
        if ((e.target as HTMLElement).closest("button, a, input")) return;
        if (!window.getSelection()?.toString()) inputRef.current?.focus();
      }}
    >
      {/* Transcript */}
      <div
        ref={scrollRef}
        role="log"
        aria-live="polite"
        className="chat-scroll flex-1 overflow-y-auto pb-3"
      >
        <div className="mb-3 rounded-md border border-white/[0.08] px-3 py-2">
          <p>
            <span className="text-emerald-400">✻</span>{" "}
            <span className="font-semibold">ditta</span>
          </p>
          <p className="text-muted">{t.intro}</p>
        </div>

        {timeline.map((item) => {
          if (item.kind === "local") {
            const { e } = item;
            return (
              <div key={`l${e.id}`} className="mt-3">
                <Row
                  mark=">"
                  markClass="text-foreground/30"
                  className="text-muted"
                >
                  {e.input}
                </Row>
                <Row mark="⎿" markClass="pl-1 text-foreground/30">
                  <CommandOutput entry={e} />
                </Row>
              </div>
            );
          }
          const { m } = item;
          const text = m.parts
            .map((p) => (p.type === "text" ? p.text : ""))
            .join("");
          if (!text) return null;
          return m.role === "user" ? (
            <Row
              key={m.id}
              mark=">"
              markClass="text-foreground/30"
              className="mt-3 text-muted"
            >
              {text}
            </Row>
          ) : (
            <Row
              key={m.id}
              mark="⏺"
              markClass="text-foreground"
              className="mt-2"
            >
              {text}
              {m.id === streamingId && <Caret />}
            </Row>
          );
        })}

        {status === "submitted" && (
          <Row mark={<Spinner />} className="mt-2 text-muted">
            {t.thinking}… <span className="text-foreground/30">(esc)</span>
          </Row>
        )}

        {errorText && (
          <Row
            mark="⎿"
            markClass="pl-1 text-foreground/30"
            className="mt-1 text-red-400/90"
          >
            {errorText}
          </Row>
        )}
      </div>

      {/* Prompt */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
        className="flex items-center gap-2 rounded-md border border-white/[0.12] px-3 py-2 transition-colors focus-within:border-white/25"
      >
        <span
          aria-hidden
          className={busy ? "text-foreground/30" : "text-foreground/70"}
        >
          &gt;
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
      </form>

      {/* Hints */}
      <p className="flex justify-between gap-3 px-1 pt-1.5 text-[11px] text-foreground/30">
        <span className="truncate">
          {busy ? (
            <>esc {t.hints.stop}</>
          ) : (
            <>
              ↵ {t.hints.send} ·{" "}
              <span className="max-sm:hidden">↑↓ {t.hints.history} · </span>
              /help
            </>
          )}
        </span>
      </p>
    </section>
  );
}

function Row({
  mark,
  markClass = "",
  className = "",
  children,
}: {
  mark: React.ReactNode;
  markClass?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`flex gap-2 ${className}`}>
      <span aria-hidden className={`w-4 shrink-0 select-none ${markClass}`}>
        {mark}
      </span>
      <p className="min-w-0 flex-1 whitespace-pre-wrap break-words">
        {children}
      </p>
    </div>
  );
}

const linkClass =
  "text-foreground underline decoration-white/20 underline-offset-2 hover:decoration-white/60";

function CommandOutput({ entry }: { entry: LocalEntry }) {
  const t = copy;
  switch (entry.cmd) {
    case "help":
      return (
        <>
          {[...COMMANDS, "clear" as const].map((c) => (
            <span key={c} className="block">
              <span className="inline-block w-24 text-foreground/80">/{c}</span>
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
            <span className="text-muted">
              {" "}
              · {entry.copied ? t.copied : t.copyFailed}
            </span>
          )}
        </>
      );
    case "links":
      return (
        <>
          {Object.entries(profile.links).map(([name, url]) => (
            <span key={name} className="block">
              <span className="inline-block w-24 text-muted">{name}</span>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
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
              <Link
                href={`/work/${p.slug}`}
                className={linkClass}
              >
                {p.title}
              </Link>
              <span className="text-muted"> · {p.summary}</span>
            </span>
          ))}
        </>
      );
    default:
      return (
        <span className="text-red-400/90">
          {t.unknown(entry.input.split(/\s+/)[0])}
        </span>
      );
  }
}

function Caret() {
  return (
    <span
      aria-hidden
      className="ml-0.5 inline-block h-[1.05em] w-[0.55em] translate-y-[0.18em] animate-[blink_1s_steps(1)_infinite] bg-foreground/70 motion-reduce:animate-none"
    />
  );
}

function Spinner() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % SPINNER.length), 110);
    return () => clearInterval(id);
  }, []);
  return <span className="text-emerald-400">{SPINNER[i]}</span>;
}
