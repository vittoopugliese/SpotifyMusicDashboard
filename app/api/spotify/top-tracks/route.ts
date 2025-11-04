import { NextRequest, NextResponse } from "next/server";
import { spotifyFetchWithUserToken, type TopTracksResponse } from "@/lib/spotify";
import { cacheGet, cacheSet, cacheKey } from "@/lib/cache";
import { withAuth } from "@/lib/api-helpers";

export async function GET(request: NextRequest) {
  return withAuth(request, async (token) => {
    const timeRange = (request.nextUrl.searchParams.get("time_range") || "medium_term") as "short_term" | "medium_term" | "long_term";
    const limit = parseInt(request.nextUrl.searchParams.get("limit") || "50");

    const key = cacheKey(["top-tracks", timeRange, limit, token.slice(-16)]);
    const cached = cacheGet<TopTracksResponse>(key);
    
    if (cached) {
      const res = NextResponse.json(cached);
      res.headers.set("X-Cache", "HIT");
      res.headers.set("Cache-Control", "private, max-age=3600");
      return res;
    }

    const data = await spotifyFetchWithUserToken<TopTracksResponse>(`/me/top/tracks?time_range=${timeRange}&limit=${limit}`, token);
    
    cacheSet(key, data, 60 * 1000);
    
    const res = NextResponse.json(data);
    res.headers.set("X-Cache", "MISS");
    res.headers.set("Cache-Control", "private, max-age=3600");
    return res;
  });
}