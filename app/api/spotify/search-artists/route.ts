import { NextRequest, NextResponse } from "next/server";
import { spotifyFetchWithUserToken } from "@/lib/spotify";
import { cookies } from "next/headers";

type SearchArtistsResponse = {
  artists: {
    items: Array<{
      id: string;
      name: string;
      images: Array<{ url: string; height: number; width: number }>;
      genres: string[];
      popularity: number;
      followers: { total: number };
      external_urls: { spotify: string };
    }>;
    total: number;
  };
};

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("spotify_access_token")?.value;

    if (!accessToken) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.trim() === "") return NextResponse.json({ error: "Query parameter 'q' is required" }, { status: 400 });

    const limit = searchParams.get("limit") || "20";

    const data = await spotifyFetchWithUserToken<SearchArtistsResponse>(`/search?q=${encodeURIComponent(query)}&type=artist&limit=${limit}`, accessToken);

    return NextResponse.json({artists: data.artists.items, total: data.artists.total});
  } catch (error) {
    console.error("Error searching artists:", error);
    return NextResponse.json({ error: "Failed to search artists" }, { status: 500 });
  }
}

