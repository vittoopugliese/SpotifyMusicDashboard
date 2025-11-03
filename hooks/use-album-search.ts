import { useState, useEffect, useRef } from "react";
import { SpotifyAlbum } from "@/lib/spotify";
import { useSpotifySession } from "@/contexts/spotify-session-context";
import { useSearchUrlSync } from "./use-search-url-sync";

interface UseAlbumSearchOptions {
  debounceMs?: number;
  limit?: number;
}

interface UseAlbumSearchReturn {
  query: string;
  setQuery: (query: string) => void;
  albums: SpotifyAlbum[];
  loading: boolean;
  error: string | null;
  isSearching: boolean;
}

export function useAlbumSearch(options: UseAlbumSearchOptions = {}): UseAlbumSearchReturn {
  const { debounceMs = 500, limit = 20 } = options;
  const { session } = useSpotifySession();
  const { initialQuery, syncUrlWithQuery } = useSearchUrlSync();

  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [albums, setAlbums] = useState<SpotifyAlbum[]>([]);
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
      setAlbums([]);
      setError(null);
      return;
    }

    if (!session.authenticated) {
      setError("Por favor inicia sesión para buscar álbumes");
      setAlbums([]);
      return;
    }

    const searchAlbums = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/spotify/search-albums?q=${encodeURIComponent(debouncedQuery)}&limit=${limit}`);
        if (!response.ok) throw new Error("Error al buscar álbumes");

        const data = await response.json();
        setAlbums(data.albums || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
        setAlbums([]);
      } finally {
        setLoading(false);
      }
    };

    searchAlbums();
  }, [debouncedQuery, session.authenticated, limit]);

  return { query, setQuery, albums, loading, error, isSearching: debouncedQuery.trim().length > 0 };
}

