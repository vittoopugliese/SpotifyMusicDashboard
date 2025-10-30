import { NextRequest, NextResponse } from "next/server";
import { getUserTopArtists } from "@/lib/spotify";

export async function GET(request: NextRequest) {
  try {
    const userToken = request.headers.get("authorization")?.replace("Bearer ", "") || request.nextUrl.searchParams.get("token");
    
    if (!userToken) return NextResponse.json({ error: "User token required" }, { status: 401 });

    const timeRange = (request.nextUrl.searchParams.get("time_range") || "medium_term") as "short_term" | "medium_term" | "long_term";
    const limit = parseInt(request.nextUrl.searchParams.get("limit") || "50");

    const data = await getUserTopArtists(userToken, timeRange, limit);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching top artists:", error);
    return NextResponse.json( { error: error instanceof Error ? error.message : "Failed to fetch top artists" }, { status: 500 } );
  }
}

