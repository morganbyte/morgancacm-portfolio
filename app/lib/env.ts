// Which environment this build belongs to. Set in next.config.ts from Vercel's
// build variables, so it's the same on the server and in the browser.
//   production → main branch, the public site
//   staging    → develop branch, the next version under test
//   preview    → any other branch (one URL per PR)
//   local      → npm run dev / build on your machine
export type AppEnv = "production" | "staging" | "preview" | "local";

export const APP_ENV = (process.env.NEXT_PUBLIC_APP_ENV ?? "local") as AppEnv;
export const isProduction = APP_ENV === "production";
