import { useState, useEffect } from "react";
import { SpotifyTrack, AudioFeatures } from "@/lib/spotify";

type TrackProfileData = {
  track: SpotifyTrack | null;
  audioFeatures: AudioFeatures | null;
  recommendations: SpotifyTrack[];
  isLoading: boolean;
  error: string | null;
};

export function useTrackProfile(trackId: string): TrackProfileData {
  const [track, setTrack] = useState<SpotifyTrack | null>(null);
  const [audioFeatures, setAudioFeatures] = useState<AudioFeatures | null>(null);
  const [recommendations, setRecommendations] = useState<SpotifyTrack[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrackData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch track info
        const trackRes = await fetch(`/api/spotify/track/${trackId}`);
        if (!trackRes.ok) throw new Error("Failed to fetch track");
        const trackData = await trackRes.json();
        setTrack(trackData);

        // Fetch audio features
        const audioFeaturesRes = await fetch(`/api/spotify/track/${trackId}/audio-features`);
        if (audioFeaturesRes.ok) {
          const audioFeaturesData = await audioFeaturesRes.json();
          setAudioFeatures(audioFeaturesData);
        }

        // Fetch recommendations
        const recommendationsRes = await fetch(`/api/spotify/track/${trackId}/recommendations?limit=10`);
        if (recommendationsRes.ok) {
          const recommendationsData = await recommendationsRes.json();
          setRecommendations(recommendationsData.tracks || []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    if (trackId) {
      fetchTrackData();
    }
  }, [trackId]);

  return { track, audioFeatures, recommendations, isLoading, error };
}

