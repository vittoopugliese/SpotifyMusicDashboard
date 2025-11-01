import { useState, useEffect } from "react";
import { SpotifyAlbum } from "@/lib/spotify";

export type TimeRange = "short_term" | "medium_term" | "long_term";

export function useTopAlbums() {
  const [timeRange, setTimeRange] = useState<TimeRange>("medium_term");
  const [albums, setAlbums] = useState<SpotifyAlbum[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlbums = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/spotify/top-albums?time_range=${timeRange}&limit=50`);
        if (!res.ok) throw new Error("Failed to fetch top albums");
        
        const data = await res.json();
        setAlbums(data.items || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setAlbums([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlbums();
  }, [timeRange]);

  return { timeRange, setTimeRange, albums, isLoading, error };
}

