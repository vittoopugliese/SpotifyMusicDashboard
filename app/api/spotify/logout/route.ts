import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const redirectUrl = new URL("/dashboard/overview", request.url);
  const res = NextResponse.redirect(redirectUrl);

  // Clear Spotify auth cookies
  res.cookies.set("spotify_access_token", "", { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 0 });
  res.cookies.set("spotify_refresh_token", "", { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 0 });
  res.cookies.set("spotify_expires_at", "", { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 0 });

  return res;
}


