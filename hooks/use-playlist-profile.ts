import { useState, useEffect } from "react";
import { SpotifyPlaylist, SpotifyTrack, PlaylistTracksResponse } from "@/lib/spotify";

type PlaylistProfileData = {
  playlist: SpotifyPlaylist | null;
  tracks: SpotifyTrack[];
  isLoading: boolean;
  error: string | null;
};

export function usePlaylistProfile(playlistId: string): PlaylistProfileData {
  const [playlist, setPlaylist] = useState<SpotifyPlaylist | null>(null);
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlaylistData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch playlist info
        const playlistRes = await fetch(`/api/spotify/playlist/${playlistId}`);
        if (!playlistRes.ok) throw new Error("Failed to fetch playlist");
        const playlistData = await playlistRes.json();
        setPlaylist(playlistData);

        // Fetch playlist tracks (fetch all tracks by paginating if needed)
        const allTracks: SpotifyTrack[] = [];
        let offset = 0;
        const limit = 100;
        let hasMore = true;

        while (hasMore) {
          const tracksRes = await fetch(`/api/spotify/playlist/${playlistId}/tracks?limit=${limit}&offset=${offset}`);
          
          if (tracksRes.ok) {
            const tracksData: PlaylistTracksResponse = await tracksRes.json();
            const validTracks = tracksData.items.map((item) => item.track).filter((track): track is SpotifyTrack => track !== null);
            
            allTracks.push(...validTracks);
            
            if (tracksData.items.length < limit || allTracks.length >= tracksData.total) {
              hasMore = false;
            } else {
              offset += limit;
            }
          } else {
            hasMore = false;
          }
        }

        setTracks(allTracks);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    if (playlistId) {
      fetchPlaylistData();
    }
  }, [playlistId]);

  return { playlist, tracks, isLoading, error };
}

