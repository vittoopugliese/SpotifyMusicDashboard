const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const SPOTIFY_API_BASE = "https://api.spotify.com/v1";
type AppToken = { accessToken: string; expiresAt: number; };
let cachedToken: AppToken | null = null;
 
function getBasicAuthHeader(): string {
 const clientId = process.env.SPOTIFY_CLIENT_ID;
 const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) throw new Error("Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET");
  const encoded = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  return `Basic ${encoded}`;
}

async function fetchAppToken(): Promise<AppToken> {
  const res = await fetch(SPOTIFY_TOKEN_URL, {
    method: "POST",
    headers: { Authorization: getBasicAuthHeader(), "Content-Type": "application/x-www-form-urlencoded", },
    body: new URLSearchParams({ grant_type: "client_credentials" }),
    cache: "no-store",
  });
  
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Spotify token error: ${res.status} ${text}`);
  }

  const json = (await res.json()) as { access_token: string; expires_in: number };
  const token: AppToken = { accessToken: json.access_token, expiresAt: Date.now() + (json.expires_in - 30) * 1000, };
  return token;
}

async function getValidToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) return cachedToken.accessToken;
  cachedToken = await fetchAppToken();
  return cachedToken.accessToken;
}

export async function spotifyFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = await getValidToken();
  const res = await fetch(`${SPOTIFY_API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    // Never cache Spotify fetch on the server; callers can wrap with Next revalidate if needed
    cache: "no-store",
  });
  
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Spotify API ${path} failed: ${res.status} ${text}`);
  }

  return (await res.json()) as T;
}

export type AudioFeatures = {
  id: string;
  danceability: number;
  energy: number;
  valence: number;
  acousticness: number;
  instrumentalness: number;
  speechiness: number;
  tempo: number;
  liveness: number;
  loudness: number;
  mode: number; // 1 major, 0 minor
  key: number; // 0-11
  duration_ms: number;
};

export async function getArtistTopTracks(artistId: string, market = "US") {
  return spotifyFetch<{ tracks: { id: string; name: string; album: { id: string; release_date: string }; popularity: number }[] }>(`/artists/${artistId}/top-tracks?market=${market}`);
}

export async function getAudioFeaturesForTracks(trackIds: string[]): Promise<{ audio_features: AudioFeatures[] }> {
  const ids = trackIds.slice(0, 100).join(",");
  try {
    return await spotifyFetch(`/audio-features?ids=${ids}`);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    // Fallback: some environments report 403 on batch endpoint; try per-id fetches
    if (message.includes("403")) {
      const results: AudioFeatures[] = [];
      for (const id of trackIds.slice(0, 100)) {
        try {
          const one = await spotifyFetch<{ id: string } & AudioFeatures>(`/audio-features/${id}`);
          // The endpoint returns 200 with minimal body if not found; ensure id matches
          if (one?.id) results.push(one);
        } catch {
          // ignore individual failures
        }
      }
      return { audio_features: results };
    }
    throw e;
  }
}

export function groupBy<T, K extends string | number>(items: T[], keyFn: (item: T) => K): Record<K, T[]> {
  return items.reduce((acc, item) => {
    const key = keyFn(item);
    (acc[key] ||= [] as unknown as T[]).push(item);
    return acc;
  }, {} as Record<K, T[]>);
}

export function average(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return numbers.reduce((a, b) => a + b, 0) / numbers.length;
}

export function yearFromDate(date: string): number {
  // Spotify dates can be YYYY or YYYY-MM or YYYY-MM-DD
  return Number(date.slice(0, 4));
}

// User-specific endpoints (requires user access token)
export async function spotifyFetchWithUserToken<T>( path: string, userToken: string, init?: RequestInit ): Promise<T> {
  const res = await fetch(`${SPOTIFY_API_BASE}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${userToken}`, "Content-Type": "application/json", ...(init?.headers || {}), },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Spotify API ${path} failed: ${res.status} ${text}`);
  }

  return (await res.json()) as T;
}

export type SpotifyArtist = {
  id: string;
  name: string;
  images: Array<{ url: string; height: number; width: number }>;
  genres: string[];
  popularity: number;
  external_urls: { spotify: string };
};

export type SpotifyTrack = {
  id: string;
  name: string;
  artists: Array<{ id: string; name: string }>;
  album: {
    id: string;
    name: string;
    images: Array<{ url: string; height: number; width: number }>;
    release_date: string;
  };
  popularity: number;
  duration_ms: number;
  preview_url: string | null;
  external_urls: { spotify: string };
};

export type TopArtistsResponse = {
  items: SpotifyArtist[];
  total: number;
  limit: number;
  offset: number;
};

export type TopTracksResponse = {
  items: SpotifyTrack[];
  total: number;
  limit: number;
  offset: number;
};

export async function getUserTopArtists(userToken: string, timeRange: "short_term" | "medium_term" | "long_term" = "medium_term", limit = 50 ): Promise<TopArtistsResponse> {
  return spotifyFetchWithUserToken<TopArtistsResponse>(`/me/top/artists?time_range=${timeRange}&limit=${limit}`, userToken);
}

export async function getUserTopTracks( userToken: string, timeRange: "short_term" | "medium_term" | "long_term" = "medium_term", limit = 50 ): Promise<TopTracksResponse> {
  return spotifyFetchWithUserToken<TopTracksResponse>(`/me/top/tracks?time_range=${timeRange}&limit=${limit}`, userToken);
}

export function getDominantGenre(artists: SpotifyArtist[]): string {
  const genreCount: Record<string, number> = {};
  artists.forEach((artist) =>     artist.genres.forEach((genre) => genreCount[genre] = (genreCount[genre] || 0) + 1));
  const sorted = Object.entries(genreCount).sort((a, b) => b[1] - a[1]);
  return sorted[0]?.[0] || "Unknown";
}

export function getGenreDistribution(artists: SpotifyArtist[], topN = 5): Array<{ genre: string; count: number }> {
  const genreCount: Record<string, number> = {};
  artists.forEach((artist) => artist.genres.forEach((genre) => genreCount[genre] = (genreCount[genre] || 0) + 1));
  return Object.entries(genreCount).map(([genre, count]) => ({ genre, count })).sort((a, b) => b.count - a.count).slice(0, topN);
}

export function getMusicalMood(valence: number): string {
  if (valence >= 0.6) return "Feliz";
  if (valence >= 0.4) return "Equilibrado";
  return "Melancólico";
}