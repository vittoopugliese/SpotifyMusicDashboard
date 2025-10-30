import { NextRequest, NextResponse } from "next/server";
import { getUserTopTracks } from "@/lib/spotify";

export async function GET(request: NextRequest) {
  try {
    let userToken = request.cookies.get("spotify_access_token")?.value 
      || request.headers.get("authorization")?.replace("Bearer ", "") 
      || request.nextUrl.searchParams.get("token");

    const expiresAt = Number(request.cookies.get("spotify_expires_at")?.value || 0);
    if (!userToken) return NextResponse.json({ error: "User token required" }, { status: 401 });

    if (expiresAt && Date.now() >= expiresAt && request.cookies.get("spotify_refresh_token")?.value) {
      const refreshRes = await fetch(new URL("/api/spotify/refresh", request.url), { method: "POST" });
      if (refreshRes.ok) {
        userToken = request.cookies.get("spotify_access_token")?.value || userToken;
      }
    }

    const timeRange = (request.nextUrl.searchParams.get("time_range") || "medium_term") as "short_term" | "medium_term" | "long_term";
    const limit = parseInt(request.nextUrl.searchParams.get("limit") || "50");

    const data = await getUserTopTracks(userToken, timeRange, limit);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching top tracks:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to fetch top tracks" }, { status: 500 });
  }
}

