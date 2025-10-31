"use client";

import { useState, useEffect } from "react";
import type { TopArtistsResponse, TopTracksResponse } from "@/lib/spotify";

type TimeRange = "short_term" | "medium_term" | "long_term";

export function useTopArtists(timeRange: TimeRange = "medium_term") {
  const [data, setData] = useState<TopArtistsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setTimeout(() => setLoading(true), 0);
    const controller = new AbortController();
    fetch(`/api/spotify/top-artists?time_range=${timeRange}`, { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setData(data);
      })
      .catch((err) => setError(err instanceof Error ? err : new Error(String(err))))
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [timeRange]);

  return { data, loading, error };
}

export function useTopTracks(timeRange: TimeRange = "medium_term") {
  const [data, setData] = useState<TopTracksResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setTimeout(() => setLoading(true), 0);
    const controller = new AbortController();
    fetch(`/api/spotify/top-tracks?time_range=${timeRange}`, { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setData(data);
      })
      .catch((err) => setError(err instanceof Error ? err : new Error(String(err))))
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [timeRange]);

  return { data, loading, error };
}