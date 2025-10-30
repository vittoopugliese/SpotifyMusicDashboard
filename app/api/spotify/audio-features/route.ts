import { NextRequest, NextResponse } from "next/server";
import { getAudioFeaturesForTracks } from "@/lib/spotify";

export async function POST(request: NextRequest) {
  try {
    const { trackIds } = await request.json();
    
    if (!trackIds || !Array.isArray(trackIds)) return NextResponse.json({ error: "trackIds array required" }, { status: 400 });

    const data = await getAudioFeaturesForTracks(trackIds);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching audio features:", error);
    return NextResponse.json( { error: error instanceof Error ? error.message : "Failed to fetch audio features" }, { status: 500 } );
  }
}

