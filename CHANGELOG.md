# ditta changelog

Versions of ditta, the AI on the home page. The version lives in
`app/data/ditta.ts`: use `X.Y.Z-beta` on `develop`, drop `-beta` when releasing
to `main`, then tag the release `ditta-vX.Y.Z`.

## 1.2.0 (unreleased)

- Books calls with Morgan through Cal.com: finds free times in the visitor's time zone, confirms the time, name and email with the visitor, then requests the booking. Morgan accepts each one before the invite goes out. Needs `CAL_API_KEY` and `CAL_EVENT_TYPE_ID`; without them ditta asks visitors to email.
- Booking limits: 2 per IP and 10 in total per day (Upstash, in-memory fallback). If the limiter is down, no bookings.
- Shows what it's doing while a tool runs ("checking morgan's calendar…").

## 1.1.0 (unreleased)

- Model served by OpenCode (`claude-haiku-5-5`) instead of Vercel AI Gateway. Needs `OPENCODE_API_KEY`.
- Chat: the prompt wraps long text, no visible scrollbar, URLs and emails in replies are links.
- Replies are always lowercase (links keep their case).
- One-screen portfolio: ditta links each project's /work/<slug> page.
- Project knowledge from content/projects/<slug>.md, written by Morgan.
- Reads each project's public docs repo on GitHub (Vekipper: morganbyte/vekipper-docs), refreshed hourly with no redeploy.
- Contact details only when they help (asked, hiring, or missing info); no "contact morgan for more" sign-offs.
- Knows Andrés Contreras (full name) and Morgan are the same person.
- The conversation survives a reload (sessionStorage) and is gone when the tab closes.
- Slash-command autocomplete: typing / lists the commands; ↑↓ select, Tab completes, Enter runs, Esc closes.
- /retry re-asks the last question after an error or a stopped reply; the connection error suggests it.
- Prompt caching on the instructions: repeat requests within 5 minutes pay about a tenth for them.
- Usage limits in Upstash Redis when configured: 12 messages per 10 minutes per IP, shared by every server instance, plus a daily cap for all visitors (DITTA_DAILY_LIMIT, default 300). Falls back to the in-memory per-IP limit.
- Vekipper knowledge comes from its docs repo; content/projects/vekipper.md removed.
- Thinking off, so replies never come back empty.

## 1.0.0

- First version: answers questions about Morgan's work, slash commands, per-IP rate limit.
