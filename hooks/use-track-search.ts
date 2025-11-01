import { useState, useEffect } from "react";
import { SpotifyTrack } from "@/lib/spotify";
import { useSpotifySession } from "@/contexts/spotify-session-context";

interface UseTrackSearchOptions {
  debounceMs?: number;
  limit?: number;
}

interface UseTrackSearchReturn {
  query: string;
  setQuery: (query: string) => void;
  tracks: SpotifyTrack[];
  loading: boolean;
  error: string | null;
  isSearching: boolean;
}

export function useTrackSearch(options: UseTrackSearchOptions = {}): UseTrackSearchReturn {
  const { debounceMs = 500, limit = 20 } = options;
  const { session } = useSpotifySession();

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(query), debounceMs);
    return () => clearTimeout(handler);
  }, [query, debounceMs]);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setTracks([]);
      setError(null);
      return;
    }

    if (!session.authenticated) {
      setError("Por favor inicia sesión para buscar tracks");
      setTracks([]);
      return;
    }

    const searchTracks = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/spotify/search-tracks?q=${encodeURIComponent(debouncedQuery)}&limit=${limit}`);
        if (!response.ok) throw new Error("Error al buscar tracks");

        const data = await response.json();
        setTracks(data.tracks || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
        setTracks([]);
      } finally {
        setLoading(false);
      }
    };

    searchTracks();
  }, [debouncedQuery, session.authenticated, limit]);

  return { query, setQuery, tracks, loading, error, isSearching: debouncedQuery.trim().length > 0 };
}

