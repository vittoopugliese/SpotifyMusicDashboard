import { NextRequest, NextResponse } from "next/server";

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