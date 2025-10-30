import { NextRequest, NextResponse } from "next/server";

async function exchangeCodeForToken(code: string, redirectUri: string) {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) throw new Error("Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET env");

  const body = new URLSearchParams({ grant_type: "authorization_code", code, redirect_uri: redirectUri, });
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST", body, cache: "no-store",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
  });
  
  if (!res.ok) throw new Error(`Token exchange failed: ${res.status} ${await res.text()}`);
  return res.json() as Promise<{ access_token: string; refresh_token: string; expires_in: number }>;
}

export async function GET(request: NextRequest) {
  try {
    const origin = request.nextUrl.origin;
    const redirectUri = process.env.SPOTIFY_REDIRECT_URI || `${origin}/api/spotify/callback`;
    const code = request.nextUrl.searchParams.get("code");
    const state = request.nextUrl.searchParams.get("state");
    const storedState = request.cookies.get("spotify_oauth_state")?.value;

    if (!code) return NextResponse.json({ error: "Missing code" }, { status: 400 });
    if (!state || !storedState || state !== storedState) return NextResponse.json({ error: "Invalid state" }, { status: 400 });

    const token = await exchangeCodeForToken(code, redirectUri);
    const expiresAt = Date.now() + (token.expires_in - 30) * 1000;

    const isProduction = process.env.NODE_ENV === "production";
    const cookieOptions = { httpOnly: true, secure: isProduction, sameSite: "lax" as const, path: "/", };

    const response = NextResponse.redirect(new URL("/dashboard/overview", request.url));
    response.cookies.set("spotify_access_token", token.access_token, { ...cookieOptions, maxAge: token.expires_in });
    response.cookies.set("spotify_refresh_token", token.refresh_token, { ...cookieOptions, maxAge: 60 * 60 * 24 * 30 });
    response.cookies.set("spotify_expires_at", String(expiresAt), { ...cookieOptions, maxAge: token.expires_in });
    response.cookies.set("spotify_oauth_state", "", { ...cookieOptions, maxAge: 0 });
    return response;
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Callback failed" }, { status: 500 });
  }
}