import { NextResponse } from "next/server";
import { OWNER_COOKIE } from "../../../lib/ditta-access";

// GET /api/ditta/lock → forget the owner cookie on this browser.
export async function GET(req: Request) {
  const res = NextResponse.redirect(new URL("/", req.url));
  res.cookies.delete(OWNER_COOKIE);
  return res;
}
