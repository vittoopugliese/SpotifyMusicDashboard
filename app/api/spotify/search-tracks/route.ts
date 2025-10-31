import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/api-helpers";
import { spotifyFetchWithUserToken, SearchTracksResponse } from "@/lib/spotify";

export async function GET(request: NextRequest) {
  return withAuth(request, async (token) => {
    const { searchParams } = request.nextUrl;
    const query = searchParams.get("q");
    const limit = searchParams.get("limit") || "10";

    if (!query) return NextResponse.json({ error: "Query parameter 'q' is required" }, { status: 400 });

    const data = await spotifyFetchWithUserToken<SearchTracksResponse>(`/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}`, token);

    return NextResponse.json(data);
  });
}

