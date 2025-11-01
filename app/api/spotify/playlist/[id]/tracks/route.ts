import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/api-helpers";
import { spotifyFetchWithUserToken, PlaylistTracksResponse } from "@/lib/spotify";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  return withAuth(request, async (token) => {
    const { searchParams } = request.nextUrl;
    const limit = searchParams.get("limit") || "100";
    const offset = searchParams.get("offset") || "0";

    const data = await spotifyFetchWithUserToken<PlaylistTracksResponse>(
      `/playlists/${id}/tracks?limit=${limit}&offset=${offset}`,
      token
    );
    return NextResponse.json(data);
  });
}

