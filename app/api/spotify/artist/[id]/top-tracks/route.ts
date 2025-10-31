import { NextRequest, NextResponse } from "next/server";
import { spotifyFetchWithUserToken } from "@/lib/spotify";
import { withAuth } from "@/lib/api-helpers";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withAuth(request, async (token) => {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const market = searchParams.get("market") || "US";

    const data = await spotifyFetchWithUserToken(`/artists/${id}/top-tracks?market=${market}`, token);

    return NextResponse.json(data);
  });
}

