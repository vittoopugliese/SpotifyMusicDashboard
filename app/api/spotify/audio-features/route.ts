import { NextRequest, NextResponse } from "next/server";
import { getAudioFeaturesForTracksWithUser } from "@/lib/spotify";
import { cacheGet, cacheSet, cacheKey } from "@/lib/cache";

export async function POST(request: NextRequest) {
  try {
    const { trackIds } = await request.json();
    
    if (!trackIds || !Array.isArray(trackIds)) return NextResponse.json({ error: "trackIds array required" }, { status: 400 });

    let userToken = request.cookies.get("spotify_access_token")?.value 
      || request.headers.get("authorization")?.replace("Bearer ", "") 
      || request.nextUrl.searchParams.get("token") || undefined;

    const expiresAt = Number(request.cookies.get("spotify_expires_at")?.value || 0);
    if (!userToken) return NextResponse.json({ error: "user is not authenticated" }, { status: 401 });

    // Attempt silent refresh if expired
    if (expiresAt && Date.now() >= expiresAt && request.cookies.get("spotify_refresh_token")?.value) {
      const refreshRes = await fetch(new URL("/api/spotify/refresh", request.url), { method: "POST" });
      if (refreshRes.ok) userToken = request.cookies.get("spotify_access_token")?.value || userToken;
    }

    const idsKey = [...new Set(trackIds)].sort().join(",");
    const key = cacheKey(["audio-features", idsKey]);
    const cached = cacheGet<{ audio_features: import("@/lib/spotify").AudioFeatures[] }>(key);
    if (cached) {
      const res = NextResponse.json(cached);
      res.headers.set("X-Cache", "HIT");
      res.headers.set("Cache-Control", "private, max-age=3600");
      return res;
    }

    const data = await getAudioFeaturesForTracksWithUser(trackIds, userToken);
    cacheSet(key, data, 60 * 1000);
    const res = NextResponse.json(data);
    res.headers.set("X-Cache", "MISS");
    res.headers.set("Cache-Control", "private, max-age=3600");
    return res;
  } catch (error) {
    console.error("Error fetching audio features:", error);
    return NextResponse.json( { error: error instanceof Error ? error.message : "Failed to fetch audio features" }, { status: 500 } );
  }
}

