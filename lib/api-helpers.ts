import { NextRequest, NextResponse } from "next/server";
import { spotifyFetchWithUserToken, SpotifySearchResult, SpotifySearchType } from "./spotify";

/** * Gets and validates the Spotify access token from cookies/headers and automatically refreshes the token if expired */
export async function getValidAccessToken(request: NextRequest): Promise<string | null> {
  // Try to get token from cookies, headers, or query params (for dev)
  let userToken = 
    request.cookies.get("spotify_access_token")?.value || 
    request.headers.get("authorization")?.replace("Bearer ", "") || 
    request.nextUrl.searchParams.get("token");

  if (!userToken) return null;

  // Check if token is expired
  const expiresAt = Number(request.cookies.get("spotify_expires_at")?.value || 0);
  const isExpired = expiresAt && Date.now() >= expiresAt;
  const hasRefreshToken = !!request.cookies.get("spotify_refresh_token")?.value;

  // Refresh if needed
  if (isExpired && hasRefreshToken) {
    try {
      const refreshRes = await fetch(new URL("/api/spotify/refresh", request.url), { method: "POST", headers: request.headers });
      
      if (refreshRes.ok) {
        // After refresh, re-read token from cookies
        userToken = request.cookies.get("spotify_access_token")?.value || userToken;
      }

    } catch (error) {
      console.error("Token refresh failed:", error);
      return null;
    }
  }

  return userToken;
}

/** * Returns a standardized 401 Unauthorized response */
export function unauthorizedResponse(message = "Authentication required"): NextResponse {
  return NextResponse.json({ error: message }, { status: 401 });
}

/** * Returns a standardized 400 Bad Request response */
export function badRequestResponse(message: string): NextResponse {
  return NextResponse.json({ error: message }, { status: 400 });
}

/** * Returns a standardized 500 Internal Server Error response */
export function internalErrorResponse(error: unknown, context = "Operation failed"): NextResponse {
  const message = error instanceof Error ? error.message : context;
  console.error(`${context}:`, error);
  return NextResponse.json({ error: message }, { status: 500 });
}

/** * Wrapper for API routes that require authentication, handles token validation and error responses automatically */
export async function withAuth(request: NextRequest, handler: (token: string, request: NextRequest) => Promise<NextResponse>): Promise<NextResponse> {
  try {
    const token = await getValidAccessToken(request);
    if (!token) return unauthorizedResponse("User token required");
    return await handler(token, request);
  } catch (error) {
    return internalErrorResponse(error);
  }
}

/** 
 * Generic search handler for Spotify search endpoints
 * Encapsulates common logic: auth validation, query param extraction, and response formatting
 * @param request - The Next.js request object
 * @param searchType - The type of search (artist, track, album, playlist)
 * @returns A standardized search response with items array and total count
 */
export async function handleSpotifySearch<T>(request: NextRequest, searchType: SpotifySearchType): Promise<NextResponse> {
  return withAuth(request, async (token) => {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.trim() === "") return badRequestResponse("Query parameter 'q' is required");

    const limit = searchParams.get("limit") || "20";
    const data = await spotifyFetchWithUserToken<T>(`/search?q=${encodeURIComponent(query)}&type=${searchType}&limit=${limit}`, token);

    // Extract the relevant data based on search type (artists, tracks, albums, playlists)
    const responseKey = `${searchType}s` as keyof T;
    console.log(responseKey);
    console.log(data);
    const results = data[responseKey] as SpotifySearchResult<unknown>;
    console.log(results);

    return NextResponse.json({[responseKey]: results.items, total: results.total});
  });
}