"use client";

import IconTitle from "@/components/icon-title";
import { useState } from "react";
import { TrackSearchBar } from "@/components/track-search-bar";
import { TrackPlayer } from "@/components/track-player";
import { AudioFeatureGauge } from "@/components/audio-feature-gauge";
import { TechnicalInfo } from "@/components/technical-info";
import { SimilarTracks } from "@/components/similar-tracks";
import { Spinner } from "@/components/ui/spinner";
import { useTrackAnalysis, useAudioFeatureComparison } from "@/hooks/use-track-analysis";
import { SpotifyTrack } from "@/lib/spotify";
import { Music3, TrendingUp, TrendingDown } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const AUDIO_FEATURES_TO_DISPLAY = ["energy", "danceability", "valence", "acousticness", "instrumentalness", "liveness", "speechiness"] as const;

export default function TracksAnalysisPage() {
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const { track, audioFeatures, recommendations, loading, error } = useTrackAnalysis(selectedTrackId);
  const comparisons = useAudioFeatureComparison(audioFeatures);

  const handleSelectTrack = (selectedTrack: SpotifyTrack) => {
    setSelectedTrackId(selectedTrack.id);
  };

  const getComparisonText = (feature: string) => {
    const diff = comparisons[feature];
    if (!diff || Math.abs(diff) < 5) return null;
    
    const isHigher = diff > 0;
    const percentage = Math.abs(Math.round(diff));

    return (
      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
        {isHigher ? <TrendingUp className="h-4 w-4 text-green-500" /> : <TrendingDown className="h-4 w-4 text-red-500" />}
        <span>{percentage}% {isHigher ? "higher" : "lower"} than average</span>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <IconTitle icon={Music3} title="Track Analysis" subtitle="Search for a track and view its audio features, technical details, and similar tracks" />

      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-center">
          <TrackSearchBar onSelectTrack={handleSelectTrack} />
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading && (
          <div className="flex items-center flex-col justify-center py-20">
            <Spinner className="size-9" />
            <p className="text-sm text-muted-foreground mt-3">Loading track data...</p>
          </div>
        )}

        {!track && !loading && (
          <div className="text-center py-20">
            <Music3 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-xl font-semibold mb-2">Search for a track to analyze</p>
            <p className="text-muted-foreground">Discover audio features, technical details, and similar tracks</p>
          </div>
        )}

        {track && audioFeatures && !loading && (
          <>
            <TrackPlayer track={track} />

            <div className="border rounded-lg p-6 bg-card">
              <h3 className="text-lg font-semibold mb-6">Audio Features</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
                {AUDIO_FEATURES_TO_DISPLAY.map((feature) => (
                  <div key={feature} className="flex flex-col items-center">
                    <AudioFeatureGauge name={feature} value={audioFeatures[feature as keyof typeof audioFeatures] as number} description="" />
                    {getComparisonText(feature)}
                  </div>
                ))}
              </div>
            </div>

            <TechnicalInfo track={track} audioFeatures={audioFeatures} />

            <SimilarTracks tracks={recommendations} onSelectTrack={handleSelectTrack} />
          </>
        )}
      </div>
    </div>
  );
}
