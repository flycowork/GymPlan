import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get("key");
  if (!key) return NextResponse.json({ value: null });
  try {
    const value = await redis.get(`isaac:${key}`);
    return NextResponse.json({ value });
  } catch {
    return NextResponse.json({ value: null });
  }
}

export async function POST(request: NextRequest) {
  const { key, value } = await request.json();
  if (!key) return NextResponse.json({ ok: false });
  try {
    await redis.set(`isaac:${key}`, value);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
