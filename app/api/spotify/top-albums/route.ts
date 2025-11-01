import { NextRequest, NextResponse } from "next/server";
import { spotifyFetchWithUserToken, type TopTracksResponse, SpotifyAlbum } from "@/lib/spotify";
import { cacheGet, cacheSet, cacheKey } from "@/lib/cache";
import { withAuth } from "@/lib/api-helpers";

export async function GET(request: NextRequest) {
  return withAuth(request, async (token) => {
    const timeRange = (request.nextUrl.searchParams.get("time_range") || "medium_term") as "short_term" | "medium_term" | "long_term";
    const limit = parseInt(request.nextUrl.searchParams.get("limit") || "50");

    const key = cacheKey(["top-albums", timeRange, limit, token.slice(-16)]);
    const cached = cacheGet<{ items: SpotifyAlbum[]; total: number }>(key);
    
    if (cached) {
      const res = NextResponse.json(cached);
      res.headers.set("X-Cache", "HIT");
      res.headers.set("Cache-Control", "private, max-age=3600");
      return res;
    }

    // Get top tracks and extract unique albums
    const tracksData = await spotifyFetchWithUserToken<TopTracksResponse>(`/me/top/tracks?time_range=${timeRange}&limit=${limit}`, token);
    
    // Extract unique albums from tracks
    const albumMap = new Map<string, SpotifyAlbum>();
    tracksData.items.forEach((track) => {
      if (!albumMap.has(track.album.id)) {
        albumMap.set(track.album.id, {
          id: track.album.id,
          name: track.album.name,
          images: track.album.images,
          release_date: track.album.release_date,
          total_tracks: 0, // Not available from track.album
          album_type: "album", // Default value
          artists: track.artists,
          external_urls: { spotify: track.external_urls.spotify }, // Using track's external url as fallback
        });
      }
    });

    const albums = Array.from(albumMap.values());
    const result = { items: albums, total: albums.length };

    cacheSet(key, result, 60 * 1000);
    
    const res = NextResponse.json(result);
    res.headers.set("X-Cache", "MISS");
    res.headers.set("Cache-Control", "private, max-age=3600");
    return res;
  });
}

