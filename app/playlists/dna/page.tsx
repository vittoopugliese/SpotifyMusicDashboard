"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Dna } from "lucide-react";
import { usePlaylistProfile } from "@/hooks/use-playlist-profile";
import { calculateAnalytics } from "@/lib/utils";
import { SpotifyPlaylist } from "@/lib/spotify";
import IconTitle from "@/components/icon-title";
import PlaylistSelector from "@/components/playlist-selector";
import PlaylistOverviewCard from "@/components/playlist-overview-card";
import PlaylistPersonalityCard from "@/components/playlist-personality-card";
import PopularityAnalysis from "@/components/popularity-analysis";
import TemporalAnalysis from "@/components/temporal-analysis";
import ArtistComposition from "@/components/artist-composition";
import OutliersExtremes from "@/components/outliers-extremes";
import DurationAnalysis from "@/components/duration-analysis";
import ExportAnalysis from "@/components/export-analysis";
import LoadingComponent from "@/components/loading-component";
import CustomAlertComponent from "@/components/custom-alert-component";
import ViewHint from "@/components/view-hint";

export default function PlaylistsDnaPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Initialize selectedPlaylistId from URL params if available
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(() => {
    return searchParams.get("id") || null;
  });
  
  const { playlist, tracks, isLoading, error } = usePlaylistProfile(selectedPlaylistId);

  // Sync URL with selectedPlaylistId
  useEffect(() => {
    const currentId = searchParams.get("id");
    
    if (selectedPlaylistId && selectedPlaylistId !== currentId) {
      // Update URL when playlist is selected
      router.push(`/playlists/dna?id=${selectedPlaylistId}`, { scroll: false });
    } else if (!selectedPlaylistId && currentId) {
      // Clear URL when playlist is deselected
      router.push("/playlists/dna", { scroll: false });
    }
  }, [selectedPlaylistId, searchParams, router]);

  // Calculate all analytics
  const analytics = useMemo(() => {
    if (playlist && tracks) return calculateAnalytics(tracks, playlist as SpotifyPlaylist);
    return null;
  }, [tracks, playlist]);

  return (
    <div className="p-6 space-y-6">
      <IconTitle icon={Dna} title="Playlist DNA" subtitle="Analyze the DNA of your playlists and discover their unique characteristics"
        action={playlist && analytics && !isLoading ? <ExportAnalysis playlist={playlist} analytics={analytics} /> : undefined} />

      <PlaylistSelector onSelectPlaylist={setSelectedPlaylistId} selectedPlaylistName={playlist?.name} />

      { isLoading && <LoadingComponent message="Analyzing playlist DNA..." />}
      { error && <CustomAlertComponent title="Error loading playlist" description={error} variant="destructive" /> }
      { !selectedPlaylistId && !isLoading && <ViewHint title="Start Your Analysis" description="Select a playlist above to uncover its unique musical DNA and characteristics" icon={Dna} /> }

      { playlist && analytics && !isLoading && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <PlaylistOverviewCard playlist={playlist} totalDuration={analytics.totalDuration} trackCount={analytics.trackCount} />
          <PlaylistPersonalityCard personality={analytics.personality} mood={analytics.mood} era={analytics.era} diversity={analytics.diversity} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PopularityAnalysis popularityDistribution={analytics.popularityDistribution} avgPopularity={analytics.avgPopularity} />
            <TemporalAnalysis decadeDistribution={analytics.decadeDistribution} avgYear={analytics.avgYear} oldestYear={analytics.oldestYear} newestYear={analytics.newestYear} />
          </div>

          <ArtistComposition topArtists={analytics.topArtists} totalArtists={analytics.totalArtists} artistDiversity={analytics.artistDiversity} />
          <DurationAnalysis durationDistribution={analytics.durationDistribution} avgDuration={analytics.avgDuration} />
          <OutliersExtremes longest={analytics.longest} shortest={analytics.shortest} mostPopular={analytics.mostPopular} leastPopular={analytics.leastPopular} />
        </div>
      )}
    </div>
  );
}
