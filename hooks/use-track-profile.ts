import { useState, useEffect } from "react";
import { SpotifyTrack } from "@/lib/spotify";

type TrackProfileData = {
  track: SpotifyTrack | null;
  isLoading: boolean;
  error: string | null;
};

export function useTrackProfile(trackId: string): TrackProfileData {
  const [track, setTrack] = useState<SpotifyTrack | null>(null);
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

  return { track, isLoading, error };
}

