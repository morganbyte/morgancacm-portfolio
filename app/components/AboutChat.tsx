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
    rate: `rate limit reached. try again in a few minutes, or email ${profile.email}`,
    generic: "connection lost. try again in a moment.",
  },
};

const MAX_CHARS = 600;
const STORAGE_KEY = "ditta:chat";
const SPINNER = "·✢✳✶✻✽✻✶✳✢";
const COMMANDS = ["help", "email", "links", "projects"] as const;
type Command = (typeof COMMANDS)[number];
// Everything the autocomplete offers, in /help order.
const MENU = Object.keys(copy.cmds) as (keyof typeof copy.cmds)[];

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
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const busy = status === "submitted" || status === "streaming";

  // Slash-command autocomplete: typing "/" lists the commands, filtered as you
  // type. ↑↓ pick, Tab completes, Enter runs, Esc closes. It opens only on
  // typing, so recalling "/email" from history doesn't hijack the arrows.
  const [menuOpen, setMenuOpen] = useState(false);
  const [sel, setSel] = useState(0);
  const matches =
    menuOpen && /^\/\S*$/.test(input)
      ? MENU.filter((c) => c.startsWith(input.slice(1).toLowerCase()))
      : [];
  const showMenu = matches.length > 0;
  const selected = matches[Math.min(sel, matches.length - 1)];

  // The conversation survives a reload but not closing the tab (sessionStorage).
  // Restored after mount so server and client render the same first frame.
  const [restored, setRestored] = useState(false);
  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? "null");
      if (saved) {
        if (Array.isArray(saved.messages)) setMessages(saved.messages);
        if (Array.isArray(saved.local)) {
          setLocal(saved.local);
          nextId.current = Math.max(0, ...saved.local.map((e: LocalEntry) => e.id + 1));
        }
        if (Array.isArray(saved.history)) history.current = saved.history;
      }
    } catch {
      // Storage blocked or corrupt: start empty.
    }
    setRestored(true);
  }, [setMessages]);

  // Save once a reply is complete, never a half-streamed one.
  useEffect(() => {
    if (!restored || busy) return;
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ messages, local, history: history.current }),
      );
    } catch {
      // Storage full or blocked: the chat still works, it just won't survive a reload.
    }
  }, [restored, busy, messages, local]);

  // The prompt wraps long text onto new lines and grows to fit it.
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [input]);

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
    setMenuOpen(false);
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
    setMenuOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const el = e.currentTarget;
    if (showMenu && !e.nativeEvent.isComposing) {
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault();
        const n = matches.length;
        setSel((i) => (Math.min(i, n - 1) + (e.key === "ArrowUp" ? n - 1 : 1)) % n);
        return;
      }
      if (e.key === "Tab") {
        e.preventDefault();
        setInput(`/${selected}`);
        setSel(0);
        return;
      }
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        ask(`/${selected}`);
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        setMenuOpen(false);
        return;
      }
    }
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      // Enter sends, like a one-line prompt; the text only wraps visually.
      e.preventDefault();
      ask(input);
    } else if (e.key === "Escape" && busy) {
      e.preventDefault();
      stop();
    } else if (
      // On a wrapped message the arrows move the caret between lines; they
      // browse history only from the very start (↑) or end (↓) of the text.
      (e.key === "ArrowUp" && (isOneLine(el) || el.selectionEnd === 0)) ||
      (e.key === "ArrowDown" && (isOneLine(el) || el.selectionStart === el.value.length))
    ) {
      e.preventDefault();
      browseHistory(e.key === "ArrowUp" ? -1 : 1);
    }
  };

  const errorText = error
    ? error.message.includes("rate_limited")
      ? t.errors.rate
      : t.errors.generic
    : null;

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
        if ((e.target as HTMLElement).closest("button, a, textarea")) return;
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
              <Linkified text={text} />
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
        className="flex items-start gap-2 rounded-md border border-white/[0.12] px-3 py-2 transition-colors focus-within:border-white/25"
      >
        <span
          aria-hidden
          className={busy ? "text-foreground/30" : "text-foreground/70"}
        >
          &gt;
        </span>
        <textarea
          ref={inputRef}
          rows={1}
          value={input}
          onChange={(e) => {
            const v = e.currentTarget.value.replace(/\n/g, " ");
            setInput(v);
            setMenuOpen(v.startsWith("/"));
            setSel(0);
          }}
          onKeyDown={onKeyDown}
          placeholder={t.placeholder}
          maxLength={MAX_CHARS}
          aria-label={t.placeholder}
          autoComplete="off"
          role="combobox"
          aria-expanded={showMenu}
          aria-controls="ditta-commands"
          aria-autocomplete="list"
          aria-activedescendant={showMenu ? `ditta-cmd-${selected}` : undefined}
          spellCheck={false}
          className="chat-scroll max-h-40 min-w-0 flex-1 resize-none overflow-y-auto break-words bg-transparent text-foreground caret-emerald-400 placeholder:text-foreground/25 focus:outline-none"
        />
      </form>

      {/* Command autocomplete, in place of the hints */}
      {showMenu ? (
        <ul id="ditta-commands" role="listbox" className="px-1 pt-1.5 text-[12px]">
          {matches.map((c) => (
            <li
              key={c}
              id={`ditta-cmd-${c}`}
              role="option"
              aria-selected={c === selected}
              onMouseDown={(e) => {
                e.preventDefault(); // keep focus in the prompt
                ask(`/${c}`);
              }}
              // Move, not enter: a menu opening under a still cursor keeps its pick.
              onMouseMove={() => setSel(matches.indexOf(c))}
              className={`flex cursor-pointer gap-3 px-2 ${
                c === selected ? "text-emerald-400" : "text-foreground/40"
              }`}
            >
              <span className="w-20 shrink-0">/{c}</span>
              <span className={c === selected ? "text-foreground/70" : ""}>{copy.cmds[c]}</span>
            </li>
          ))}
          <li aria-hidden className="px-2 pt-1 text-[11px] text-foreground/30">
            ↑↓ select · tab complete · ↵ run · esc close
          </li>
        </ul>
      ) : (
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
      )}
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

function isOneLine(el: HTMLTextAreaElement) {
  const line = parseFloat(getComputedStyle(el).lineHeight) || 20;
  return el.scrollHeight < line * 1.5;
}

// Turns emails, URLs, bare domains (github.com/…) and this site's project
// pages (/work/<slug>) in ditta's replies into links, styled like the ones
// /links prints. ditta always writes in lowercase: the prose is lowercased
// here too, links keep their case.
const LINK_RE =
  /([\w.+-]+@[\w-]+(?:\.[\w-]+)+)|(https?:\/\/[^\s<>"']+|\b(?:www\.)?[a-z0-9-]+(?:\.[a-z0-9-]+)*\.(?:com|dev|app|io|co|me|net|org|ai)(?![\w-])(?:\/[^\s<>"']*)?)|((?<![\w./])\/work\/[a-z0-9-]+)/gi;

function Linkified({ text }: { text: string }) {
  const out: React.ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(LINK_RE)) {
    let raw = m[0];
    // Sentence punctuation right after a link isn't part of it.
    const trail = raw.match(/[.,;:!?)\]]+$/)?.[0] ?? "";
    raw = raw.slice(0, raw.length - trail.length);
    const start = m.index;
    if (start > last) out.push(text.slice(last, start).toLowerCase());
    if (m[3]) {
      out.push(
        <Link key={start} href={raw.toLowerCase()} className={linkClass}>
          {raw}
        </Link>,
      );
    } else {
      const href = m[1]
        ? `mailto:${raw}`
        : /^https?:\/\//i.test(raw)
          ? raw
          : `https://${raw}`;
      out.push(
        <a
          key={start}
          href={href}
          {...(m[1] ? {} : { target: "_blank", rel: "noopener noreferrer" })}
          className={linkClass}
        >
          {raw}
        </a>,
      );
    }
    last = start + raw.length;
  }
  if (last < text.length) out.push(text.slice(last).toLowerCase());
  return <>{out}</>;
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
