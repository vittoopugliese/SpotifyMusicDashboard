"use client";

import { useState, useEffect, useCallback } from "react";
import { SpotifyTrack, AudioFeatures, TrackRecommendations } from "@/lib/spotify";

type TrackAnalysisState = {
  track: SpotifyTrack | null;
  audioFeatures: AudioFeatures | null;
  recommendations: SpotifyTrack[];
  loading: boolean;
  error: string | null;
};

export function useTrackAnalysis(trackId: string | null) {
  const [state, setState] = useState<TrackAnalysisState>({track: null, audioFeatures: null, recommendations: [], loading: false, error: null});

  const fetchTrackData = useCallback(async (id: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const [trackRes, audioFeaturesRes, recommendationsRes] = await Promise.all([fetch(`/api/spotify/track/${id}`), fetch(`/api/spotify/track/${id}/audio-features`), fetch(`/api/spotify/track/${id}/recommendations?limit=5`)]);
      if (!trackRes.ok || !audioFeaturesRes.ok || !recommendationsRes.ok) throw new Error("Failed to fetch track data");
      const [track, audioFeatures, recommendationsData] = await Promise.all([trackRes.json(), audioFeaturesRes.json(), recommendationsRes.json()]);
      setState({ track, audioFeatures, recommendations: (recommendationsData as TrackRecommendations).tracks || [], loading: false, error: null });
    } catch (error) {
      setState(prev => ({...prev, loading: false, error: error instanceof Error ? error.message : "An error occurred"}));
    }
  }, []);

  useEffect(() => {
    if (trackId) fetchTrackData(trackId);
    else setState({ track: null, audioFeatures: null, recommendations: [], loading: false, error: null });
  }, [trackId, fetchTrackData]);

  return { ...state, refetch: () => trackId && fetchTrackData(trackId), };
}

// Hook para calcular comparaciones con promedios
export function useAudioFeatureComparison(audioFeatures: AudioFeatures | null) {
  const [comparisons, setComparisons] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!audioFeatures) {
      setTimeout(() => setComparisons({}), 0);
      return;
    }

    const averages = { energy: 0.5, danceability: 0.5, valence: 0.5, acousticness: 0.3, instrumentalness: 0.15, liveness: 0.2, speechiness: 0.1, };

    const newComparisons: Record<string, number> = {};

    Object.entries(averages).forEach(([key, avg]) => {
      const featureValue = audioFeatures[key as keyof AudioFeatures] as number;
      const percentageDiff = ((featureValue - avg) / avg) * 100;
      newComparisons[key] = percentageDiff;
    });

    setTimeout(() => setComparisons(newComparisons), 0);
  }, [audioFeatures]);

  return comparisons;
}