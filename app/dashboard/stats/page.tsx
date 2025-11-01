"use client";

import StatCard from "@/components/stat-card";
import Link from "next/link"
import TitleWithPeriodSelector from "@/components/title-with-period-selector";
import { useState, useMemo } from "react";
import { useTopArtists, useTopTracks } from "@/hooks/use-spotify-data";
import { average, yearFromDate, getGenreDistribution } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Download, Music2, BarChart3, TrendingUp, Clock, Palette, Calendar } from "lucide-react";
import ArtistMiniCard from "@/components/artist-mini-card";

type TimeRange = "short_term" | "medium_term" | "long_term";

export default function StatsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("medium_term");

  const { data: artistsData, loading: artistsLoading } = useTopArtists(timeRange);
  const { data: tracksData, loading: tracksLoading } = useTopTracks(timeRange);

  const isLoading = artistsLoading || tracksLoading;

  const radarData = useMemo(() => {
    if (!artistsData?.items || !tracksData?.items) return null;

    // Popularity (0-100 -> 0-1)
    const avgPopularity = average(tracksData.items.map((t) => t.popularity)) / 100;
    
    // Genre Diversity (0-1, based on unique genres count)
    const allGenres = artistsData.items.flatMap((a) => a.genres);
    const uniqueGenres = new Set(allGenres);
    const genreDiversity = Math.min(uniqueGenres.size / 50, 1); // Max diversity at 50 genres
    
    // Mainstream Score (average artist popularity)
    const avgArtistPopularity = average(artistsData.items.map((a) => a.popularity)) / 100;
    
    // Recency (how recent are the tracks - 0-1)
    const currentYear = new Date().getFullYear();
    const avgYear = average(tracksData.items.map((t) => yearFromDate(t.album.release_date)));
    const recency = Math.max(0, Math.min(1, (avgYear - 1960) / (currentYear - 1960)));
    
    // Artist Loyalty (fewer unique artists = higher loyalty)
    const uniqueArtists = new Set(tracksData.items.flatMap((t) => t.artists.map((a) => a.id)));
    const artistLoyalty = Math.max(0, 1 - (uniqueArtists.size / tracksData.items.length));

    return [
      { subject: "Popularity", value: avgPopularity, fullMark: 1 },
      { subject: "Genre Diversity", value: genreDiversity, fullMark: 1 },
      { subject: "Mainstream", value: avgArtistPopularity, fullMark: 1 },
      { subject: "Recency", value: recency, fullMark: 1 },
      { subject: "Artist Loyalty", value: artistLoyalty, fullMark: 1 },
    ];
  }, [artistsData, tracksData]);

  const musicStats = useMemo(() => {
    if (!artistsData?.items || !tracksData?.items) return null;
    
    const avgPopularity = Math.round(average(tracksData.items.map((t) => t.popularity)));
    const avgDuration = Math.round(average(tracksData.items.map((t) => t.duration_ms)) / 1000);
    const allGenres = artistsData.items.flatMap((a) => a.genres);
    const uniqueGenres = new Set(allGenres).size;
    const avgYear = Math.round(average(tracksData.items.map((t) => yearFromDate(t.album.release_date))));
    
    return { avgPopularity, avgDuration, uniqueGenres, avgYear };
  }, [artistsData, tracksData]);

  const decadeData = useMemo(() => {
    if (!tracksData?.items || tracksData.items.length === 0) return [];

    const decadeCount: Record<string, number> = {};
    tracksData.items.forEach((track) => {
      const year = yearFromDate(track.album.release_date);
      if (year > 0) {
        const decade = Math.floor(year / 10) * 10;
        const decadeLabel = `${decade}s`;
        decadeCount[decadeLabel] = (decadeCount[decadeLabel] || 0) + 1;
      }
    });

    return Object.entries(decadeCount).map(([decade, count]) => ({ decade, count })).sort((a, b) => a.decade.localeCompare(b.decade));
  }, [tracksData]);

  const genreData = useMemo(() => {
    if (!artistsData?.items || artistsData.items.length === 0) return [];
    return getGenreDistribution(artistsData.items, 8);
  }, [artistsData]);

  const handleExportStats = () => {
    const stats = {
      timeRange,
      totalArtists: artistsData?.total || 0,
      totalTracks: tracksData?.total || 0,
      musicTasteProfile: radarData,
      musicStats,
      topArtists: artistsData?.items?.slice(0, 10) || [],
      topTracks: tracksData?.items?.slice(0, 10) || [],
      decadeDistribution: decadeData,
      genreDistribution: genreData,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(stats, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `spotify-stats-${timeRange}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6">
      <TitleWithPeriodSelector title="Your Stats" icon={BarChart3} 
        value={timeRange} onChange={setTimeRange} className="mb-4" subtitle="Analysis of your musical preferences based on your favorite artists and tracks"
        actions={<Button variant="outline" onClick={handleExportStats} className="gap-2"><Download className="h-4 w-4" />Export Stats</Button>} />

      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-1 flex items-center gap-2"><Music2 className="h-5 w-5" />Music Taste Profile</h2>
        {isLoading ? (
          <Skeleton className="h-96 w-full" />
        ) : radarData ? (
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={90} domain={[0, 1]} />
              <Radar name="Your Music" dataKey="value" stroke="#1DB954" fill="#1DB954" fillOpacity={0.6} />
              <Legend />
              <Tooltip formatter={(value: number) => `${Math.round(value * 100)}%`} />
            </RadarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-muted-foreground text-center py-12">No data available</p>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={TrendingUp} title="Popularity" value={isLoading || !musicStats ? "—" : `${musicStats.avgPopularity}/100`} loading={isLoading} tooltipDescription="Average popularity of your favorite songs in Spotify (0-100)" />
        <StatCard icon={Clock} title="Average Duration" value={isLoading || !musicStats ? "—" : `${Math.floor(musicStats.avgDuration / 60)}:${String(musicStats.avgDuration % 60).padStart(2, '0')}`} loading={isLoading} tooltipDescription="Average duration of your favorite songs" />
        <StatCard icon={Palette} title="Unique Genres" value={isLoading || !musicStats ? "—" : `${musicStats.uniqueGenres}`} loading={isLoading} tooltipDescription="Number of unique genres in your library" />
        <StatCard icon={Calendar} title="Average Year" value={isLoading || !musicStats ? "—" : `~${musicStats.avgYear}`} loading={isLoading} tooltipDescription="Average year of release of your favorite songs" />
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4 overflow-auto max-h-[900px]">
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Top Artists</h2>
          {isLoading ? (
            <div className="grid grid-cols-2 gap-4">{[...Array(6)].map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}</div>
          ) : artistsData?.items && artistsData.items.length > 0 ? (
            <div className="grid grid-cols-5 gap-4 overflow-auto max-h-[600px]">
              {artistsData.items.map((artist) => <ArtistMiniCard key={artist.id} artist={artist} simplified />)}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-12">No artists available</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Tracks by Decade</h2>
          {isLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : decadeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={decadeData}>
                <XAxis dataKey="decade" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#1DB954" />
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-muted-foreground text-center py-12">No data available</p>}
        </div>

        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Top Genres</h2>
          {isLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : genreData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={genreData} layout="vertical">
                <XAxis type="number" />
                <YAxis type="category" dataKey="genre" width={120} />
                <Tooltip />
                <Bar dataKey="count" fill="#1DB954" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-muted-foreground text-center py-12">No data available</p>}
        </div>
      </div>
    </div>
  );
}
