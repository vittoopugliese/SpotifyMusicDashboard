import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const baseUrl = process.env.NODE_ENV === "development" ? process.env.NEXT_PUBLIC_SPORI_DEV_REDIRECT_URL : process.env.NEXT_PUBLIC_SPORI_PROD_REDIRECT_URL;
  const res = NextResponse.redirect(`${baseUrl}/dashboard/overview`);

  // Clear Spotify auth cookies
  const isSecure = request.nextUrl.protocol === "https:";
  res.cookies.set("spotify_access_token", "", { httpOnly: true, secure: isSecure, sameSite: "lax", path: "/", maxAge: 0 });
  res.cookies.set("spotify_refresh_token", "", { httpOnly: true, secure: isSecure, sameSite: "lax", path: "/", maxAge: 0 });
  res.cookies.set("spotify_expires_at", "", { httpOnly: true, secure: isSecure, sameSite: "lax", path: "/", maxAge: 0 });

  return res;
}