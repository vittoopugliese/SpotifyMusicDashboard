import { NextRequest, NextResponse } from "next/server";

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env ${name}`);
  return value;
}

async function refreshAccessToken(refreshToken: string) {
  const clientId = getEnv("SPOTIFY_CLIENT_ID");
  const clientSecret = getEnv("SPOTIFY_CLIENT_SECRET");
  const body = new URLSearchParams({ grant_type: "refresh_token", refresh_token: refreshToken });
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST", body, cache: "no-store",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
  });
  if (!res.ok) throw new Error(`Refresh failed: ${res.status} ${await res.text()}`);
  return res.json() as Promise<{ access_token: string; expires_in: number }>;
}

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get("spotify_refresh_token")?.value;
    if (!refreshToken) return NextResponse.json({ error: "No refresh token" }, { status: 401 });
    const token = await refreshAccessToken(refreshToken);
    const expiresAt = Date.now() + (token.expires_in - 30) * 1000;
    const res = NextResponse.json({ ok: true });
    res.cookies.set("spotify_access_token", token.access_token, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: token.expires_in });
    res.cookies.set("spotify_expires_at", String(expiresAt), { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: token.expires_in });
    return res;
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Refresh failed" }, { status: 500 });
  }
}