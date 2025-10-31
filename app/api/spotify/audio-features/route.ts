import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/api-helpers";
import { spotifyFetchWithUserToken } from "@/lib/spotify";
import { AudioFeatures } from "@/lib/spotify";

export async function GET(request: NextRequest) {
  return withAuth(request, async (token) => {
    const { searchParams } = request.nextUrl;
    const ids = searchParams.get("ids");

    if (!ids) return NextResponse.json({ error: "Query parameter 'ids' is required" }, { status: 400 });

    const trackIds = ids.split(",").slice(0, 50);
    const data = await spotifyFetchWithUserToken<AudioFeatures[]>(`/audio-features?ids=${trackIds.join(",")}`, token);

    return NextResponse.json(data);
  });
}

