import { useState, useEffect } from "react";
import { SpotifyAlbum, SpotifyTrack } from "@/lib/spotify";

type AlbumProfileData = {
  album: SpotifyAlbum | null;
  tracks: SpotifyTrack[];
  isLoading: boolean;
  error: string | null;
};

export function useAlbumProfile(albumId: string): AlbumProfileData {
  const [album, setAlbum] = useState<SpotifyAlbum | null>(null);
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlbumData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch album info
        const albumRes = await fetch(`/api/spotify/album/${albumId}`);
        if (!albumRes.ok) throw new Error("Failed to fetch album");
        const albumData = await albumRes.json();
        setAlbum(albumData);

        // Fetch tracks
        const tracksRes = await fetch(`/api/spotify/album/${albumId}/tracks?limit=50`);
        if (tracksRes.ok) {
          const tracksData = await tracksRes.json();
          setTracks(tracksData.tracks || []);
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    if (albumId) {
      fetchAlbumData();
    }
  }, [albumId]);

  return { album, tracks, isLoading, error };
}

