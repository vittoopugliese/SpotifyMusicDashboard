import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const accessToken = request.cookies.get("spotify_access_token")?.value || null;
    const expiresAt = Number(request.cookies.get("spotify_expires_at")?.value || 0);

    if (!accessToken) return NextResponse.json({ authenticated: false });

    // If expired, try to refresh transparently
    if (expiresAt && Date.now() >= expiresAt) {
      const refreshRes = await fetch(new URL("/api/spotify/refresh", request.url), { method: "POST" });
      if (!refreshRes.ok) return NextResponse.json({ authenticated: false });
    }

    const token = request.cookies.get("spotify_access_token")?.value || accessToken;
    // Fetch user profile for display
    const meRes = await fetch("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!meRes.ok) return NextResponse.json({ authenticated: false });
    const profile = await meRes.json();
    return NextResponse.json({ authenticated: true, profile });
  } catch {
    return NextResponse.json({ authenticated: false });
  }
}