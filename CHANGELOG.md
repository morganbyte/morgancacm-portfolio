# ditta changelog

Versions of ditta, the AI on the home page. The version lives in
`app/data/ditta.ts`: use `X.Y.Z-beta` on `develop`, drop `-beta` when releasing
to `main`, then tag the release `ditta-vX.Y.Z`.

## 1.1.0 (unreleased)

- Model served by OpenCode (`claude-haiku-5-5`) instead of Vercel AI Gateway. Needs `OPENCODE_API_KEY`.
- Chat: the prompt wraps long text, no visible scrollbar, URLs and emails in replies are links.
- Replies are always lowercase (links keep their case).
- One-screen portfolio: ditta links each project's /work/<slug> page.
- Project knowledge from content/projects/<slug>.md, written by Morgan.
- Reads each project's public docs repo on GitHub (Vekipper: morganbyte/vekipper-docs), refreshed hourly with no redeploy.
- Thinking off, so replies never come back empty.

## 1.0.0

- First version: answers questions about Morgan's work, slash commands, per-IP rate limit.
