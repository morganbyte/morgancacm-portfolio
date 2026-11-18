import { NextResponse } from "next/server";
import { isOwnerKey, OWNER_COOKIE } from "../../../lib/ditta-access";

// GET /api/ditta/unlock?key=<DITTA_OWNER_KEY> → this browser can use ditta in
// production while it's private. A wrong or missing key looks like a 404.
export async function GET(req: Request) {
  const key = new URL(req.url).searchParams.get("key") ?? undefined;
  if (!isOwnerKey(key)) return new NextResponse(null, { status: 404 });

  const res = NextResponse.redirect(new URL("/", req.url));
  res.cookies.set(OWNER_COOKIE, key!, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return res;
}
