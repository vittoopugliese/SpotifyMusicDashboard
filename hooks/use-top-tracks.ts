import { useState, useEffect } from "react";
import { SpotifyTrack, AudioFeatures } from "@/lib/spotify";

export type TimeRange = "short_term" | "medium_term" | "long_term";

export type TrackWithAudioFeatures = SpotifyTrack & {
  audioFeatures?: AudioFeatures;
};

export type TopTracksTab = "your" | "global" | "genre";

export function useTopTracks() {
  const [timeRange, setTimeRange] = useState<TimeRange>("medium_term");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [tracks, setTracks] = useState<TrackWithAudioFeatures[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTracks = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch user's top tracks
        const res = await fetch(`/api/spotify/top-tracks?time_range=${timeRange}&limit=50`);
        if (!res.ok) throw new Error("Failed to fetch top tracks");
        
        const data = await res.json();
        const topTracks: SpotifyTrack[] = data.items || [];

        // Fetch audio features for all tracks
        if (topTracks.length > 0) {
          const trackIds = topTracks.map(t => t.id).join(",");
          const audioRes = await fetch(`/api/spotify/audio-features?ids=${trackIds}`);
          
          if (audioRes.ok) {
            const audioData = await audioRes.json();
            const audioFeaturesMap = new Map<string, AudioFeatures>();
            
            audioData.audio_features?.forEach((af: AudioFeatures | null) => {
              if (af) audioFeaturesMap.set(af.id, af);
            });

            const tracksWithFeatures: TrackWithAudioFeatures[] = topTracks.map(track => ({
              ...track,
              audioFeatures: audioFeaturesMap.get(track.id),
            }));

            setTracks(tracksWithFeatures);
          } else {
            setTracks(topTracks);
          }
        } else {
          setTracks([]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setTracks([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTracks();
  }, [timeRange, selectedGenre]);

  return { timeRange, setTimeRange, selectedGenre, setSelectedGenre, tracks, isLoading, error, };
}