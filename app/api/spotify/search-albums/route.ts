import { NextRequest, NextResponse } from "next/server";
import { SearchAlbumsResponse, spotifyFetchWithUserToken } from "@/lib/spotify";
import { withAuth, badRequestResponse } from "@/lib/api-helpers";

export async function GET(request: NextRequest) {
  return withAuth(request, async (token) => {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.trim() === "") return badRequestResponse("Query parameter 'q' is required");

    const limit = searchParams.get("limit") || "20";
    const data = await spotifyFetchWithUserToken<SearchAlbumsResponse>(`/search?q=${encodeURIComponent(query)}&type=album&limit=${limit}`, token);

    return NextResponse.json({ albums: data.albums.items, total: data.albums.total });
  });
}

