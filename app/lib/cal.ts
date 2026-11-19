// Cal.com API v2, so ditta can book calls on Morgan's calendar.
//
// Morgan's availability, the meeting length, the video link and the emails all
// live in Cal.com (one event type, connected to Google Calendar). The event
// type is set to "requires confirmation": every booking ditta makes arrives as
// a request that Morgan accepts or rejects, and the visitor gets the invite
// only once it's accepted.
//
// Needs CAL_API_KEY and CAL_EVENT_TYPE_ID. Without them ditta can't book and
// asks visitors to email instead.

const API = "https://api.cal.com/v2";
const API_KEY = process.env.CAL_API_KEY;
const EVENT_TYPE_ID = Number(process.env.CAL_EVENT_TYPE_ID);

export const calEnabled = Boolean(API_KEY && EVENT_TYPE_ID);

const MAX_DAYS = 14; // how far ahead one search looks
const MAX_PER_DAY = 8; // slots offered per day, to keep tool results small

export function isTimeZone(tz: unknown): tz is string {
  if (typeof tz !== "string" || !tz) return false;
  try {
    new Intl.DateTimeFormat("en", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

/** YYYY-MM-DD of `date` in `timeZone`. */
function dayIn(date: Date, timeZone: string) {
  return new Intl.DateTimeFormat("en-CA", { timeZone, dateStyle: "short" }).format(date);
}

type SlotsResponse = {
  status: string;
  data?: Record<string, (string | { start: string })[]>;
};

/** Free slots from `from` (YYYY-MM-DD, visitor's zone) for `days` days. */
export async function findSlots({
  from,
  days,
  timeZone,
}: {
  from?: string;
  days?: number;
  timeZone: string;
}) {
  const today = dayIn(new Date(), timeZone);
  const start = from && /^\d{4}-\d{2}-\d{2}$/.test(from) && from > today ? from : today;
  const span = Math.min(Math.max(Math.round(days ?? 7), 1), MAX_DAYS);
  const end = new Date(`${start}T00:00:00Z`);
  end.setUTCDate(end.getUTCDate() + span - 1);

  const params = new URLSearchParams({
    eventTypeId: String(EVENT_TYPE_ID),
    start,
    end: end.toISOString().slice(0, 10),
    timeZone,
  });
  const res = await fetch(`${API}/slots?${params}`, {
    headers: { "cal-api-version": "2024-09-04", Authorization: `Bearer ${API_KEY}` },
    signal: AbortSignal.timeout(8000),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`cal.com slots ${res.status}`);
  const body = (await res.json()) as SlotsResponse;

  const weekday = new Intl.DateTimeFormat("en", { timeZone, weekday: "short" });
  const time = new Intl.DateTimeFormat("en-GB", { timeZone, hour: "2-digit", minute: "2-digit" });
  const now = Date.now();
  const slots = Object.entries(body.data ?? {}).flatMap(([date, list]) => {
    const starts = list
      .map((s) => (typeof s === "string" ? s : s.start))
      .filter((s) => new Date(s).getTime() > now)
      .slice(0, MAX_PER_DAY);
    if (!starts.length) return [];
    const d = new Date(starts[0]);
    return [
      {
        date,
        weekday: weekday.format(d).toLowerCase(),
        // `start` is what book_meeting takes; `time` is what the visitor sees.
        times: starts.map((s) => ({ time: time.format(new Date(s)), start: s })),
      },
    ];
  });

  return { today, timeZone, slots };
}

type BookingResponse = {
  status: string;
  data?: { uid: string; status: string; start: string; end: string };
  error?: { message?: string };
};

export async function bookMeeting(input: {
  start: string;
  name: string;
  email: string;
  topic?: string;
  language: "en" | "es";
  timeZone: string;
}) {
  const start = new Date(input.start);
  if (Number.isNaN(start.getTime()) || start.getTime() < Date.now()) {
    return { ok: false as const, error: "that time is invalid or already past; search slots again" };
  }

  const res = await fetch(`${API}/bookings`, {
    method: "POST",
    headers: {
      "cal-api-version": "2026-02-25",
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      start: start.toISOString(),
      eventTypeId: EVENT_TYPE_ID,
      attendee: {
        name: input.name,
        email: input.email,
        timeZone: input.timeZone,
        language: input.language,
      },
      // "notes" is the default "Additional notes" field of every event type.
      ...(input.topic ? { bookingFieldsResponses: { notes: input.topic } } : {}),
      metadata: { source: "ditta" },
    }),
    signal: AbortSignal.timeout(10000),
  });
  const body = (await res.json().catch(() => ({}))) as BookingResponse;
  if (!res.ok || !body.data) {
    console.error("[ditta] cal.com booking failed", res.status, body.error?.message);
    // Usually the slot was just taken, or the email was rejected.
    return {
      ok: false as const,
      error: body.error?.message ?? `booking failed (${res.status}); the slot may be taken`,
    };
  }
  return {
    ok: true as const,
    // "pending" until Morgan accepts it.
    status: body.data.status,
    start: body.data.start,
    end: body.data.end,
  };
}
