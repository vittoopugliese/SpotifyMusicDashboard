import { average } from "./utils";

const SPOTIFY_API_BASE = "https://api.spotify.com/v1";

// TYPES

export type SpotifyUserProfile = {
  id: string;
  display_name?: string;
  email?: string;
  images?: Array<{url: string; height?: number; width?: number}>;
  country?: string;
  followers?: {total?: number};
};

export type SpotifyArtist = {
  id: string;
  name: string;
  images: Array<{url: string; height: number; width: number}>;
  genres: string[];
  popularity: number;
  followers?: {total: number};
  external_urls: {spotify: string};
};

export type SpotifyTrack = {
  id: string;
  name: string;
  artists: Array<{id: string; name: string}>;
  album: {
    id: string;
    name: string;
    images: Array<{url: string; height: number; width: number}>;
    release_date: string;
  };
  popularity: number;
  duration_ms: number;
  preview_url: string | null;
  external_urls: {spotify: string};
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

export type AverageAudioFeatures = {
  danceability: number;
  energy: number;
  valence: number;
  acousticness: number;
  instrumentalness: number;
  speechiness: number;
  tempo: number;
  liveness: number;
  loudness: number;
};

// User-specific endpoints (requires user access token)
// This fn is called from hooks and pass here the api route
export async function spotifyFetchWithUserToken<T>( path: string, userToken: string, init?: RequestInit ): Promise<T> {
  const body = {...init, cache: "no-store", headers: { Authorization: `Bearer ${userToken}`, "Content-Type": "application/json", ...(init?.headers || {}) }}
  const res = await fetch(`${SPOTIFY_API_BASE}${path}`, body as RequestInit);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Spotify API ${path} failed: ${res.status} ${text}`);
  }

  return (await res.json()) as T;
}

export async function getCurrentUserProfile(userToken: string): Promise<SpotifyUserProfile> {
  return spotifyFetchWithUserToken<SpotifyUserProfile>(`/me`, userToken);
}

export async function getUserTopArtists(userToken: string, timeRange: "short_term" | "medium_term" | "long_term" = "medium_term", limit = 50 ): Promise<TopArtistsResponse> {
  return spotifyFetchWithUserToken<TopArtistsResponse>(`/me/top/artists?time_range=${timeRange}&limit=${limit}`, userToken);
}

export async function getUserTopTracks( userToken: string, timeRange: "short_term" | "medium_term" | "long_term" = "medium_term", limit = 50 ): Promise<TopTracksResponse> {
  return spotifyFetchWithUserToken<TopTracksResponse>(`/me/top/tracks?time_range=${timeRange}&limit=${limit}`, userToken);
}

export function getAverageAudioFeatures(features: AudioFeatures[]): AverageAudioFeatures {
  if (features.length === 0) return { danceability: 0, energy: 0, valence: 0, acousticness: 0, instrumentalness: 0, speechiness: 0, tempo: 0, liveness: 0, loudness: 0, };

  return {
    danceability: average(features.map(f => f.danceability)),
    energy: average(features.map(f => f.energy)),
    valence: average(features.map(f => f.valence)),
    acousticness: average(features.map(f => f.acousticness)),
    instrumentalness: average(features.map(f => f.instrumentalness)),
    speechiness: average(features.map(f => f.speechiness)),
    tempo: average(features.map(f => f.tempo)),
    liveness: average(features.map(f => f.liveness)),
    loudness: average(features.map(f => f.loudness)),
  };
}