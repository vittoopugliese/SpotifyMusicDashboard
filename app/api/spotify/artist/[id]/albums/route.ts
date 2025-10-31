import { NextRequest, NextResponse } from "next/server";
import { spotifyFetchWithUserToken } from "@/lib/spotify";
import { withAuth } from "@/lib/api-helpers";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withAuth(request, async (token) => {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit") || "20";

    const data = await spotifyFetchWithUserToken(
      `/artists/${id}/albums?include_groups=album,single&limit=${limit}`,
      token
    );

    return NextResponse.json(data);
  });
}

