import { useState, useEffect } from "react";
import { SpotifyArtist, SpotifyTrack, SpotifyAlbum } from "@/lib/spotify";

type ArtistProfileData = {
  artist: SpotifyArtist | null;
  topTracks: SpotifyTrack[];
  albums: SpotifyAlbum[];
  isLoading: boolean;
  error: string | null;
};

export function useArtistProfile(artistId: string): ArtistProfileData {
  const [artist, setArtist] = useState<SpotifyArtist | null>(null);
  const [topTracks, setTopTracks] = useState<SpotifyTrack[]>([]);
  const [albums, setAlbums] = useState<SpotifyAlbum[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArtistData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch artist info
        const artistRes = await fetch(`/api/spotify/artist/${artistId}`);
        if (!artistRes.ok) throw new Error("Failed to fetch artist");
        const artistData = await artistRes.json();
        setArtist(artistData);

        // Fetch top tracks
        const topTracksRes = await fetch(`/api/spotify/artist/${artistId}/top-tracks`);
        if (topTracksRes.ok) {
          const topTracksData = await topTracksRes.json();
          setTopTracks(topTracksData.tracks || []);
        }

        // Fetch albums
        const albumsRes = await fetch(`/api/spotify/artist/${artistId}/albums?limit=20`);
        if (albumsRes.ok) {
          const albumsData = await albumsRes.json();
          setAlbums(albumsData.items || []);
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    if (artistId) {
      fetchArtistData();
    }
  }, [artistId]);

  return { artist, topTracks, albums, isLoading, error };
}

