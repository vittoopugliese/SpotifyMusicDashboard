import { NextRequest, NextResponse } from "next/server";
import { getAudioFeaturesForTracks } from "@/lib/spotify";
import { cacheGet, cacheSet, cacheKey } from "@/lib/cache";

export async function POST(request: NextRequest) {
  try {
    const { trackIds } = await request.json();
    
    if (!trackIds || !Array.isArray(trackIds)) return NextResponse.json({ error: "trackIds array required" }, { status: 400 });

    const idsKey = [...new Set(trackIds)].sort().join(",");
    const key = cacheKey(["audio-features", idsKey]);
    const cached = cacheGet<{ audio_features: import("@/lib/spotify").AudioFeatures[] }>(key);
    if (cached) {
      const res = NextResponse.json(cached);
      res.headers.set("X-Cache", "HIT");
      res.headers.set("Cache-Control", "private, max-age=60");
      return res;
    }

    const data = await getAudioFeaturesForTracks(trackIds);
    cacheSet(key, data, 60 * 1000);
    const res = NextResponse.json(data);
    res.headers.set("X-Cache", "MISS");
    res.headers.set("Cache-Control", "private, max-age=60");
    return res;
  } catch (error) {
    console.error("Error fetching audio features:", error);
    return NextResponse.json( { error: error instanceof Error ? error.message : "Failed to fetch audio features" }, { status: 500 } );
  }
}

