import { useState, useEffect, useRef } from "react";
import { SpotifyPlaylist } from "@/lib/spotify";
import { useSpotifySession } from "@/contexts/spotify-session-context";
import { useSearchUrlSync } from "./use-search-url-sync";

interface UsePlaylistSearchOptions {
  debounceMs?: number;
  limit?: number;
}

interface UsePlaylistSearchReturn {
  query: string;
  setQuery: (query: string) => void;
  playlists: SpotifyPlaylist[];
  loading: boolean;
  error: string | null;
  isSearching: boolean;
}

export function usePlaylistSearch(options: UsePlaylistSearchOptions = {}): UsePlaylistSearchReturn {
  const { debounceMs = 500, limit = 20 } = options;
  const { session } = useSpotifySession();
  const { initialQuery, syncUrlWithQuery } = useSearchUrlSync();

  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
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
      setPlaylists([]);
      setError(null);
      return;
    }

    if (!session.authenticated) {
      setError("Por favor inicia sesión para buscar playlists");
      setPlaylists([]);
      return;
    }

    const searchPlaylists = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/spotify/search-playlists?q=${encodeURIComponent(debouncedQuery)}&limit=${limit}`);
        if (!response.ok) throw new Error("Error al buscar playlists");

        const data = await response.json();
        setPlaylists(data.playlists.filter((playlist: SpotifyPlaylist) => !!playlist) || []); // a veces retorna nulls dentro del array por alguna razon (?)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
        setPlaylists([]);
      } finally {
        setLoading(false);
      }
    };

    searchPlaylists();
  }, [debouncedQuery, session.authenticated, limit]);

  return { query, setQuery, playlists, loading, error, isSearching: debouncedQuery.trim().length > 0, };
}

