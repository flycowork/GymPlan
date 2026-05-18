import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { cookies } from "next/headers";

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

const SESSION_COOKIE = "gym-session";
const SESSION_KEY = "isaac:session";
const SESSION_TTL = 60 * 60 * 24 * 30; // 30 days in seconds

function randomToken(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// POST /api/auth — verify PIN, issue session cookie
export async function POST(request: NextRequest) {
  const { pin } = await request.json();
  const appPin = process.env.APP_PIN;

  if (!appPin) {
    // No PIN configured — allow access (dev mode)
    return NextResponse.json({ ok: true });
  }

  if (String(pin) !== String(appPin)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const token = randomToken();

  try {
    await redis.set(SESSION_KEY, token, { ex: SESSION_TTL });
  } catch {
    // Redis not configured yet — skip session storage, just set cookie
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_TTL,
    path: "/",
  });
  return response;
}

// GET /api/auth — validate session cookie
export async function GET() {
  const appPin = process.env.APP_PIN;

  // No PIN configured — always authenticated
  if (!appPin) {
    return NextResponse.json({ authenticated: true });
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    return NextResponse.json({ authenticated: false });
  }

  try {
    const stored = await redis.get(SESSION_KEY);
    if (stored === token) {
      return NextResponse.json({ authenticated: true });
    }
    return NextResponse.json({ authenticated: false });
  } catch {
    // Redis unavailable — trust the cookie value exists
    return NextResponse.json({ authenticated: true });
  }
}
