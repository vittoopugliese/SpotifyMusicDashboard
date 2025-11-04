import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/api-helpers";
import { spotifyFetchWithUserToken, UserPlaylistsResponse } from "@/lib/spotify";

export async function GET(request: NextRequest) {
  return withAuth(request, async (token) => {
    const { searchParams } = request.nextUrl;
    const limit = searchParams.get("limit") || "50";
    const offset = searchParams.get("offset") || "0";

    const data = await spotifyFetchWithUserToken<UserPlaylistsResponse>(`/me/playlists?limit=${limit}&offset=${offset}`, token);
    
    return NextResponse.json(data);
  });
}