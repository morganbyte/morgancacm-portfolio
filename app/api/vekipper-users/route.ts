// Proxy to Vekipper's public user count, so the browser talks to this origin
// (no CORS on Vekipper's side) and every visitor shares one cached response.
const SOURCE = process.env.VEKIPPER_STATS_URL ?? "https://vekipper.com/api/stats/users";

export async function GET() {
  try {
    const res = await fetch(SOURCE, { next: { revalidate: 30 } });
    if (!res.ok) throw new Error(`status ${res.status}`);
    const { users } = (await res.json()) as { users: unknown };
    if (typeof users !== "number") throw new Error("bad payload");
    return Response.json(
      { users },
      { headers: { "Cache-Control": "public, max-age=0, s-maxage=30, stale-while-revalidate=60" } },
    );
  } catch {
    // The card just hides the count; nothing to show the visitor.
    return Response.json({ users: null }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
