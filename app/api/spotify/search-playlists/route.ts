import { NextRequest, NextResponse } from "next/server";
import { withAuth, badRequestResponse } from "@/lib/api-helpers";
import { spotifyFetchWithUserToken, SearchPlaylistsResponse } from "@/lib/spotify";

export async function GET(request: NextRequest) {
  return withAuth(request, async (token) => {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const limit = searchParams.get("limit") || "20";

    if (!query || query.trim() === "") return badRequestResponse("Query parameter 'q' is required");

    const data = await spotifyFetchWithUserToken<SearchPlaylistsResponse>(`/search?q=${encodeURIComponent(query)}&type=playlist&limit=${limit}`, token);

    return NextResponse.json({ playlists: data.playlists.items, total: data.playlists.total });
  });
}

