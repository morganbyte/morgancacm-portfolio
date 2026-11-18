import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { isProduction } from "./env";

// Who may talk to ditta.
//   owner  → Morgan: always in local/staging/preview (those are private
//            already), and in production with the owner cookie.
//   public → anyone, only once DITTA_PUBLIC=true is set in production.
//   closed → everyone else while ditta is private.
// Unlock production on a browser by visiting /api/ditta/unlock?key=<DITTA_OWNER_KEY>.
export type DittaAccess = "owner" | "public" | "closed";

export const OWNER_COOKIE = "ditta_owner";

export function isOwnerKey(value: string | undefined) {
  const key = process.env.DITTA_OWNER_KEY;
  if (!key || !value) return false;
  // Hash both sides so the comparison is constant-time whatever the length.
  const a = createHash("sha256").update(value).digest();
  const b = createHash("sha256").update(key).digest();
  return timingSafeEqual(a, b);
}

export async function dittaAccess(): Promise<DittaAccess> {
  if (!isProduction) return "owner";
  const jar = await cookies();
  if (isOwnerKey(jar.get(OWNER_COOKIE)?.value)) return "owner";
  return process.env.DITTA_PUBLIC === "true" ? "public" : "closed";
}
