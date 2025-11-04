import { NextRequest } from "next/server";
import { SearchAlbumsResponse } from "@/lib/spotify";
import { handleSpotifySearch } from "@/lib/api-helpers";
import { ProfileType } from "@/components/profile-hero";

export async function GET(request: NextRequest) {
  return handleSpotifySearch<SearchAlbumsResponse>(request, ProfileType.Album);
}