import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/api-helpers";
import { spotifyFetchWithUserToken, AudioFeatures } from "@/lib/spotify";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  return withAuth(request, async (token) => {
    const data = await spotifyFetchWithUserToken<AudioFeatures>(`/audio-features/${id}`, token);
    return NextResponse.json(data);
  });
}

