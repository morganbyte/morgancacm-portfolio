# ditta changelog

Versions of ditta, the AI on the home page. The version lives in
`app/data/ditta.ts`: use `X.Y.Z-beta` on `develop`, drop `-beta` when releasing
to `main`, then tag the release `ditta-vX.Y.Z`.

## 1.1.0 (unreleased)

- Private beta: in production only the owner can chat (unlock with `/api/ditta/unlock?key=…`); `DITTA_PUBLIC=true` opens it to everyone.
- No rate limit for the owner.

## 1.0.0

- First version: answers questions about Morgan's work, slash commands, per-IP rate limit.
