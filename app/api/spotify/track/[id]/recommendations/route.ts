import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/api-helpers";
import { spotifyFetchWithUserToken, TrackRecommendations } from "@/lib/spotify";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  return withAuth(request, async (token) => {
    const { searchParams } = request.nextUrl;
    const limit = searchParams.get("limit") || "5";

    const data = await spotifyFetchWithUserToken<TrackRecommendations>(`/recommendations?seed_tracks=${id}&limit=${limit}`, token);

    return NextResponse.json(data);
  });
}

