import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const origin = request.nextUrl.origin;
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const redirectUri = process.env.SPOTIFY_REDIRECT_URI || `${origin}/api/spotify/callback`;

    if (!clientId) return NextResponse.json({ error: "Missing SPOTIFY_CLIENT_ID env" }, { status: 500 });

    const scope = ["user-top-read", "user-read-email", "user-read-private"].join(" ");
    const state = Math.random().toString(36).slice(2);
    const url = new URL("https://accounts.spotify.com/authorize");
    url.searchParams.set("response_type", "code");
    url.searchParams.set("client_id", clientId);
    url.searchParams.set("redirect_uri", redirectUri);
    url.searchParams.set("scope", scope);
    url.searchParams.set("state", state);
    
    const isProduction = process.env.NODE_ENV === "production";
    const res = NextResponse.redirect(url.toString());
    res.cookies.set("spotify_oauth_state", state, { httpOnly: true, secure: isProduction, sameSite: "lax", path: "/", maxAge: 600, });
    return res;
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Login init failed" }, { status: 500 });
  }
}