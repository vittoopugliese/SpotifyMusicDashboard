"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Dna } from "lucide-react";
import IconTitle from "@/components/icon-title";
import PlaylistSelector from "@/components/playlist-dna/playlist-selector";
import PlaylistOverviewCard from "@/components/playlist-dna/playlist-overview-card";
import PlaylistPersonalityCard from "@/components/playlist-dna/playlist-personality-card";
import PopularityAnalysis from "@/components/playlist-dna/popularity-analysis";
import TemporalAnalysis from "@/components/playlist-dna/temporal-analysis";
import ArtistComposition from "@/components/playlist-dna/artist-composition";
import OutliersExtremes from "@/components/playlist-dna/outliers-extremes";
import DurationAnalysis from "@/components/playlist-dna/duration-analysis";
import ExportAnalysis from "@/components/playlist-dna/export-analysis";
import LoadingComponent from "@/components/loading-component";
import CustomAlertComponent from "@/components/custom-alert-component";
import ViewHint from "@/components/view-hint";
import { usePlaylistProfile } from "@/hooks/use-playlist-profile";
import { average, yearFromDate } from "@/lib/utils";

export default function PlaylistsDnaPage() {
  const searchParams = useSearchParams();
  const initialPlaylistId = searchParams.get("id") || "";
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string>(initialPlaylistId);
  const { playlist, tracks, isLoading, error } = usePlaylistProfile(selectedPlaylistId);

  // Calculate all analytics
  const analytics = useMemo(() => {
    if (!tracks || tracks.length === 0 || !playlist) return null;

    // Basic stats
    const totalDuration = tracks.reduce((sum, t) => sum + t.duration_ms, 0);
    const avgDuration = totalDuration / tracks.length;
    const trackCount = tracks.length;

    // Popularity analysis
    const avgPopularity = Math.round(average(tracks.map((t) => t.popularity)));
    const popularityDistribution = [
      { range: "0-20", count: tracks.filter((t) => t.popularity < 20).length },
      { range: "20-40", count: tracks.filter((t) => t.popularity >= 20 && t.popularity < 40).length },
      { range: "40-60", count: tracks.filter((t) => t.popularity >= 40 && t.popularity < 60).length },
      { range: "60-80", count: tracks.filter((t) => t.popularity >= 60 && t.popularity < 80).length },
      { range: "80-100", count: tracks.filter((t) => t.popularity >= 80).length },
    ];

    // Temporal analysis
    const years = tracks.map((t) => yearFromDate(t.album.release_date)).filter((y) => y > 0);
    const avgYear = Math.round(average(years));
    const oldestYear = Math.min(...years);
    const newestYear = Math.max(...years);
    
    const decadeCounts: Record<string, number> = {};
    years.forEach((year) => {
      const decade = `${Math.floor(year / 10) * 10}s`;
      decadeCounts[decade] = (decadeCounts[decade] || 0) + 1;
    });
    const decadeDistribution = Object.entries(decadeCounts)
      .map(([decade, count]) => ({ decade, count }))
      .sort((a, b) => a.decade.localeCompare(b.decade));

    // Artist analysis
    const artistCounts: Record<string, { count: number; name: string; image?: string }> = {};
    tracks.forEach((track) => {
      track.artists.forEach((artist) => {
        if (!artistCounts[artist.id]) {
          artistCounts[artist.id] = { count: 0, name: artist.name };
        }
        artistCounts[artist.id].count++;
      });
    });

    const topArtists = Object.entries(artistCounts)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.count - a.count);

    const totalArtists = topArtists.length;
    const artistDiversity = Math.min(totalArtists / trackCount, 1);

    // Duration analysis
    const durationDistribution = [
      { range: "< 2 min", count: tracks.filter((t) => t.duration_ms < 120000).length },
      { range: "2-3 min", count: tracks.filter((t) => t.duration_ms >= 120000 && t.duration_ms < 180000).length },
      { range: "3-4 min", count: tracks.filter((t) => t.duration_ms >= 180000 && t.duration_ms < 240000).length },
      { range: "4-5 min", count: tracks.filter((t) => t.duration_ms >= 240000 && t.duration_ms < 300000).length },
      { range: "> 5 min", count: tracks.filter((t) => t.duration_ms >= 300000).length },
    ];

    // Outliers
    const sortedByDuration = [...tracks].sort((a, b) => a.duration_ms - b.duration_ms);
    const sortedByPopularity = [...tracks].sort((a, b) => a.popularity - b.popularity);

    const longest = sortedByDuration[sortedByDuration.length - 1];
    const shortest = sortedByDuration[0];
    const mostPopular = sortedByPopularity[sortedByPopularity.length - 1];
    const leastPopular = sortedByPopularity[0];

    // Personality generation
    const getPersonality = () => {
      let personality = "This playlist ";
      
      // Popularity aspect
      if (avgPopularity >= 70) {
        personality += "is packed with mainstream hits and chart-toppers, ";
      } else if (avgPopularity >= 40) {
        personality += "strikes a balance between popular tracks and hidden gems, ";
      } else {
        personality += "dives deep into underground and niche music, ";
      }

      // Era aspect
      if (avgYear >= 2018) {
        personality += "featuring contemporary sounds from the modern era. ";
      } else if (avgYear >= 2010) {
        personality += "showcasing the vibrant music scene of the 2010s. ";
      } else if (avgYear >= 2000) {
        personality += "bringing back the nostalgic vibes of the 2000s. ";
      } else {
        personality += "taking you on a journey through classic music history. ";
      }

      // Diversity aspect
      if (artistDiversity >= 0.6) {
        personality += "With a diverse range of artists, it's perfect for music exploration and discovery.";
      } else {
        personality += "It focuses on a curated selection of artists, reflecting strong musical preferences.";
      }

      return personality;
    };

    const getMood = () => {
      if (avgPopularity >= 70) return "Energetic & Mainstream";
      if (avgPopularity >= 40) return "Balanced & Eclectic";
      return "Alternative & Niche";
    };

    const getEra = () => {
      if (avgYear >= 2020) return "Modern (2020s)";
      if (avgYear >= 2010) return "Contemporary (2010s)";
      if (avgYear >= 2000) return "Millennial (2000s)";
      if (avgYear >= 1990) return "90s Nostalgia";
      if (avgYear >= 1980) return "80s Classic";
      return "Timeless Classics";
    };

    const getDiversity = () => {
      if (artistDiversity >= 0.8) return "Extremely Diverse";
      if (artistDiversity >= 0.6) return "Very Diverse";
      if (artistDiversity >= 0.4) return "Moderately Diverse";
      return "Focused Selection";
    };

    return {
      // Basic
      totalDuration,
      avgDuration,
      trackCount,
      
      // Popularity
      avgPopularity,
      popularityDistribution,
      
      // Temporal
      avgYear,
      oldestYear,
      newestYear,
      decadeDistribution,
      
      // Artists
      topArtists,
      totalArtists,
      artistDiversity,
      
      // Duration
      durationDistribution,
      
      // Outliers
      longest,
      shortest,
      mostPopular,
      leastPopular,
      
      // Personality
      personality: getPersonality(),
      mood: getMood(),
      era: getEra(),
      diversity: getDiversity(),
    };
  }, [tracks, playlist]);

  return (
    <div className="p-6 space-y-6">
      <IconTitle icon={Dna} title="Playlist DNA" subtitle="Analyze the DNA of your playlists and discover their unique characteristics"
        action={playlist && analytics && !isLoading ? <ExportAnalysis playlist={playlist} analytics={analytics} /> : undefined}
      />

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
