# Portfolio: working rules

## Release flow (Morgan decides every step)

Every change goes through three stages, and **each move to the next stage happens only when Morgan explicitly says so**. Never push, open a PR, merge or deploy on your own initiative, even if the change is finished and tested.

1. **Local (default).** All work starts here: a local `feat/*` branch created from `develop`, tested on `localhost:3000` (`npm run dev`). Commits stay local. Do **not** `git push`, open PRs or deploy.
2. **Staging, only when Morgan says so.** Push the branch and merge it into `develop` (via PR). `develop` deploys to https://staging-morgancacm-portfolio.vercel.app (protected by Vercel Authentication).
3. **Production, only when Morgan says so.** PR `develop` → `main` and merge. `main` deploys to https://morgancacm-portfolio.vercel.app. `main` is protected: changes enter only by PR.

When a change is ready locally, say so and wait. "Ready" is never permission to move to the next stage.

If a new branch depends on work that isn't in `develop` yet, create it from that branch, not from `develop`, so local keeps working.

## Environments

- `app/lib/env.ts` exposes `APP_ENV` (`production` | `staging` | `preview` | `local`), set in `next.config.ts` from Vercel's build vars. Anything that isn't production is `noindex` and shows the environment next to ditta's version in the footer.
- Env vars: `OPENCODE_API_KEY` (Vercel: Production + Preview; local: `.env.local`). `DITTA_MODEL` optionally overrides the model per environment.

## ditta (the AI chat)

- Model: Claude Haiku 5.5 (`claude-haiku-5-5`) from OpenCode's Anthropic-compatible endpoint, paid from OpenCode credits. See `app/api/chat/route.ts`.
- Versioning: `app/data/ditta.ts` holds the version. Use `X.Y.Z-beta` on `develop`, drop `-beta` when releasing to `main`, add an entry to `CHANGELOG.md` and tag `ditta-vX.Y.Z`.
