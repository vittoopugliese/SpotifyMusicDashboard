import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/api-helpers";
import { AlbumTracksResponse, spotifyFetchWithUserToken } from "@/lib/spotify";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get("limit") || "50";
  const offset = searchParams.get("offset") || "0";

  return withAuth(request, async (token) => {
    // Spotify albums/{id}/tracks returns tracks directly, not wrapped in a "track" property
    const data = await spotifyFetchWithUserToken<AlbumTracksResponse>(`/albums/${id}/tracks?limit=${limit}&offset=${offset}`, token);
    return NextResponse.json({ tracks: data.items || [], total: data.total, limit: data.limit, offset: data.offset });
  });
}

