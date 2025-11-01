import { useState, useEffect } from "react";
import { SpotifyPlaylist } from "@/lib/spotify";
import { useSpotifySession } from "@/contexts/spotify-session-context";

type UserPlaylistsData = {
  playlists: SpotifyPlaylist[];
  isLoading: boolean;
  error: string | null;
};

export function useUserPlaylists(): UserPlaylistsData {
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { session } = useSpotifySession();

  useEffect(() => {
    const fetchPlaylists = async () => {
      if (!session.authenticated) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Fetch all playlists by paginating if needed
        const allPlaylists: SpotifyPlaylist[] = [];
        let offset = 0;
        const limit = 50;
        let hasMore = true;

        while (hasMore) {
          const res = await fetch(`/api/spotify/user-playlists?limit=${limit}&offset=${offset}`);
          
          if (!res.ok) throw new Error("Failed to fetch playlists");
          
          const data = await res.json();
          allPlaylists.push(...data.items);
          
          if (data.items.length < limit || allPlaylists.length >= data.total) {
            hasMore = false;
          } else {
            offset += limit;
          }
        }

        setPlaylists(allPlaylists);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaylists();
  }, [session.authenticated]);

  return { playlists, isLoading, error };
}

