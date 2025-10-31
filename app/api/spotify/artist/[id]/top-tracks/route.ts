import { NextRequest, NextResponse } from "next/server";
import { spotifyFetchWithUserToken } from "@/lib/spotify";
import { cookies } from "next/headers";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("spotify_access_token")?.value;

    if (!accessToken) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const market = searchParams.get("market") || "US";

    const data = await spotifyFetchWithUserToken(`/artists/${id}/top-tracks?market=${market}`, accessToken);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching top tracks:", error);
    return NextResponse.json({ error: "Failed to fetch top tracks" }, { status: 500 });
  }
}

