import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { APP_ENV } from "./env";

// Two limits on ditta, so nobody can burn the AI credits:
//   - per visitor: 12 messages every 10 minutes per IP
//   - per day: DITTA_DAILY_LIMIT messages across all visitors (default 300),
//     resetting at 00:00 UTC
//
// The counters live in Upstash Redis (Vercel Marketplace), shared by every
// server instance. Without its env vars (e.g. local without `vercel env pull`)
// it falls back to an in-memory per-IP limit, per instance. If Redis is slow or
// down, requests go through: a broken limiter must not break ditta.

export type LimitResult = "ok" | "rate_limited" | "daily_limit";

const PER_IP = { limit: 12, window: "10 m", windowMs: 10 * 60_000 } as const;
const DAILY = Number(process.env.DITTA_DAILY_LIMIT) || 300;

const hasRedis = Boolean(
  (process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL) &&
    (process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN),
);

const redis = hasRedis ? Redis.fromEnv() : null;
// Keys carry the environment, so tests on local or staging don't use up
// production's daily allowance.
const prefix = `ditta:${APP_ENV}`;

const perIp = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(PER_IP.limit, PER_IP.window),
      prefix: `${prefix}:ip`,
      timeout: 1000,
    })
  : null;

const perDay = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.fixedWindow(DAILY, "1 d"),
      prefix: `${prefix}:day`,
      timeout: 1000,
      ephemeralCache: false, // one shared key: the in-memory cache would undercount
    })
  : null;

export async function checkLimits(ip: string): Promise<LimitResult> {
  if (!perIp || !perDay) return memoryLimited(ip) ? "rate_limited" : "ok";
  try {
    // Per IP first, so a blocked visitor doesn't count against the daily total.
    if (!(await perIp.limit(ip)).success) return "rate_limited";
    if (!(await perDay.limit("all")).success) return "daily_limit";
  } catch (err) {
    console.error("[ditta] rate limit unavailable", err);
  }
  return "ok";
}

// Fallback: best-effort, per server instance.
const hits = new Map<string, number[]>();
function memoryLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < PER_IP.windowMs);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > PER_IP.limit;
}

// Bookings through ditta: 2 per IP and 10 in total per day. Every booking is a
// request Morgan still has to accept, so this only keeps the inbox sane.
const BOOKINGS = { perIp: 2, perDay: 10 } as const;

const bookPerIp = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.fixedWindow(BOOKINGS.perIp, "1 d"),
      prefix: `${prefix}:book-ip`,
      timeout: 1000,
    })
  : null;

const bookPerDay = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.fixedWindow(BOOKINGS.perDay, "1 d"),
      prefix: `${prefix}:book-day`,
      timeout: 1000,
      ephemeralCache: false,
    })
  : null;

const bookHits = new Map<string, number[]>();

export async function canBook(ip: string): Promise<boolean> {
  if (!bookPerIp || !bookPerDay) {
    const now = Date.now();
    const recent = (bookHits.get(ip) ?? []).filter((t) => now - t < 86_400_000);
    if (recent.length >= BOOKINGS.perIp) return false;
    bookHits.set(ip, [...recent, now]);
    return true;
  }
  try {
    if (!(await bookPerIp.limit(ip)).success) return false;
    return (await bookPerDay.limit("all")).success;
  } catch (err) {
    // Unlike chat messages, a booking isn't worth risking: fail closed.
    console.error("[ditta] booking limit unavailable", err);
    return false;
  }
}
