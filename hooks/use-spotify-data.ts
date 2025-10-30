"use client";

import { useState, useEffect } from "react";
import type { TopArtistsResponse, TopTracksResponse, AudioFeatures } from "@/lib/spotify";

type TimeRange = "short_term" | "medium_term" | "long_term";

export function useTopArtists(token: string | null, timeRange: TimeRange = "medium_term") {
  const [data, setData] = useState<TopArtistsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`/api/spotify/top-artists?time_range=${timeRange}&token=${encodeURIComponent(token)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setData(data);
      })
      .catch((err) => setError(err instanceof Error ? err : new Error(String(err))))
      .finally(() => setLoading(false));
  }, [token, timeRange]);

  return { data, loading, error };
}

export function useTopTracks(token: string | null, timeRange: TimeRange = "medium_term") {
  const [data, setData] = useState<TopTracksResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`/api/spotify/top-tracks?time_range=${timeRange}&token=${encodeURIComponent(token)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setData(data);
      })
      .catch((err) => setError(err instanceof Error ? err : new Error(String(err))))
      .finally(() => setLoading(false));
  }, [token, timeRange]);

  return { data, loading, error };
}

export function useAudioFeatures(token: string | null, trackIds: string[]) {
  const [data, setData] = useState<{ audio_features: AudioFeatures[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!token || trackIds.length === 0) {
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch("/api/spotify/audio-features", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trackIds }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setData(data);
      })
      .catch((err) => setError(err instanceof Error ? err : new Error(String(err))))
      .finally(() => setLoading(false));
  }, [token, trackIds.join(",")]);

  return { data, loading, error };
}

