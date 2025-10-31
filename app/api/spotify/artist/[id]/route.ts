import { NextRequest, NextResponse } from "next/server";
import { spotifyFetchWithUserToken } from "@/lib/spotify";
import { cookies } from "next/headers";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("spotify_access_token")?.value;

    if (!accessToken) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const { id } = await params;

    const artist = await spotifyFetchWithUserToken(`/artists/${id}`, accessToken);

    return NextResponse.json(artist);
  } catch (error) {
    console.error("Error fetching artist:", error);
    return NextResponse.json({ error: "Failed to fetch artist" }, { status: 500 });
  }
}

