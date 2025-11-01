const SPOTIFY_API_BASE = "https://api.spotify.com/v1";

// TYPES

export type SpotifyUserProfile = {
  id: string;
  display_name?: string;
  email?: string;
  images?: Array<{url: string; height?: number; width?: number}>;
  country?: string;
  followers?: {total?: number};
  external_urls?: {spotify: string};
  product: string;
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

export type SpotifyAlbum = {
  id: string;
  name: string;
  images: Array<{url: string; height: number; width: number}>;
  release_date: string;
  total_tracks: number;
  album_type: string;
  artists: Array<{id: string; name: string}>;
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

export type AlbumTracksResponse = {
  items: SpotifyTrack[];
  total: number;
  limit: number;
  offset: number;
};

export type SearchArtistsResponse = {
  artists: {
    items: Array<{
      id: string;
      name: string;
      images: Array<{ url: string; height: number; width: number }>;
      genres: string[];
      popularity: number;
      followers: { total: number };
      external_urls: { spotify: string };
    }>;
    total: number;
  };
};

export type SearchTracksResponse = {
  tracks: {
    items: SpotifyTrack[];
    total: number;
    limit: number;
    offset: number;
  };
};

export type AudioFeatures = {
  id: string;
  acousticness: number;
  danceability: number;
  energy: number;
  instrumentalness: number;
  key: number;
  liveness: number;
  loudness: number;
  mode: number;
  speechiness: number;
  tempo: number;
  time_signature: number;
  valence: number;
  duration_ms: number;
};

export type TrackRecommendations = {
  tracks: SpotifyTrack[];
  seeds: Array<{
    id: string;
    type: string;
    href: string;
  }>;
};

export type SpotifyPlaylist = {
  id: string;
  name: string;
  description: string | null;
  images: Array<{url: string; height: number; width: number}>;
  owner: {
    id: string;
    display_name: string;
    external_urls: {spotify: string};
  };
  followers: {
    total: number;
  };
  public: boolean;
  tracks: {
    href: string;
    total: number;
  };
  external_urls: {spotify: string};
};

export type PlaylistTracksResponse = {
  items: Array<{
    track: SpotifyTrack | null;
    added_at: string;
  }>;
  total: number;
  limit: number;
  offset: number;
};

export type UserPlaylistsResponse = {
  items: SpotifyPlaylist[];
  total: number;
  limit: number;
  offset: number;
};

export type SearchPlaylistsResponse = {
  playlists: {
    items: SpotifyPlaylist[];
    total: number;
    limit: number;
    offset: number;
  };
};

export type SearchAlbumsResponse = {
  albums: {
    items: SpotifyAlbum[];
    total: number;
    limit: number;
    offset: number;
  };
};

export type TopAlbumsResponse = {
  items: SpotifyAlbum[];
  total: number;
  limit: number;
  offset: number;
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