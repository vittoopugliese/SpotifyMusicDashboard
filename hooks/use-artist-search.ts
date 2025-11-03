import { useState, useEffect, useRef } from "react";
import { SpotifyArtist } from "@/lib/spotify";
import { useSpotifySession } from "@/contexts/spotify-session-context";
import { useSearchUrlSync } from "./use-search-url-sync";

interface UseArtistSearchOptions {
  debounceMs?: number;
  limit?: number;
}

interface UseArtistSearchReturn {
  query: string;
  setQuery: (query: string) => void;
  artists: SpotifyArtist[];
  loading: boolean;
  error: string | null;
  isSearching: boolean;
}

export function useArtistSearch( options: UseArtistSearchOptions = {} ): UseArtistSearchReturn {
  const { debounceMs = 500, limit = 20 } = options;
  const { session } = useSpotifySession();
  const { initialQuery, syncUrlWithQuery } = useSearchUrlSync();

  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [artists, setArtists] = useState<SpotifyArtist[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastSyncedQuery = useRef(initialQuery);

  // Debounce para búsqueda API
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(query), debounceMs);
    return () => clearTimeout(handler);
  }, [query, debounceMs]);

  // Sincronizar URL cuando query cambia (solo si realmente cambió)
  useEffect(() => {
    if (query !== lastSyncedQuery.current) {
      lastSyncedQuery.current = query;
      syncUrlWithQuery(query);
    }
  }, [query, syncUrlWithQuery]);

  // Realizar búsqueda
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setArtists([]);
      setError(null);
      return;
    }

    if (!session.authenticated) {
      setError("Por favor inicia sesión para buscar artistas");
      setArtists([]);
      return;
    }

    const searchArtists = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/spotify/search-artists?q=${encodeURIComponent(debouncedQuery)}&limit=${limit}`);
        if (!response.ok) throw new Error("Error al buscar artistas");

        const data = await response.json();
        setArtists(data.artists || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
        setArtists([]);
      } finally {
        setLoading(false);
      }
    };

    searchArtists();
  }, [debouncedQuery, session.authenticated, limit]);

  return { query, setQuery, artists, loading, error, isSearching: debouncedQuery.trim().length > 0, };
}

