import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/api-helpers";
import { spotifyFetchWithUserToken, TrackRecommendations } from "@/lib/spotify";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  return withAuth(request, async (token) => {
    try {
      const { searchParams } = request.nextUrl;
      const limit = searchParams.get("limit") || "10";

      const data = await spotifyFetchWithUserToken<TrackRecommendations>(`/recommendations?seed_tracks=${id}&limit=${limit}`, token);

      return NextResponse.json(data);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      return NextResponse.json({ error: "Failed to fetch recommendations", tracks: [] }, { status: 500 });
    }
  });
}

