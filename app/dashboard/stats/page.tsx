"use client";

import { useState, useMemo } from "react";
import { useTopArtists, useTopTracks } from "@/hooks/use-spotify-data";
import { average, yearFromDate, getGenreDistribution } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Download, Music2, BarChart3, TrendingUp, Clock, Palette, Calendar, Users } from "lucide-react";
import StatCard from "@/components/stat-card";
import TitleWithPeriodSelector from "@/components/title-with-period-selector";
import ArtistMiniCard from "@/components/artist-mini-card";
import IconSubtitle from "@/components/icon-subtitle";
import DashboardStatsSkeleton from "@/components/page-skeletons/dashboard-stats-skeleton";

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

  if (isLoading) return <DashboardStatsSkeleton />;

  return (
    <div className="p-6 space-y-6">
      <TitleWithPeriodSelector title="Your Stats" icon={BarChart3} 
        value={timeRange} onChange={setTimeRange} className="mb-6" subtitle="Analysis of your musical preferences"
        actions={<Button variant="outline" onClick={handleExportStats} className="gap-2"><Download className="h-4 w-4" />Export Stats</Button>} />

      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <IconSubtitle icon={Music2} title="Music Taste Profile" subtitle="Your music profile based on your favorite artists and tracks" small />
        {radarData ? (
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
        <StatCard icon={TrendingUp} title="Popularity" value={!musicStats ? "—" : `${musicStats.avgPopularity}/100`} loading={false} tooltipDescription="Average popularity of your favorite songs in Spotify (0-100)" />
        <StatCard icon={Clock} title="Average Duration" value={!musicStats ? "—" : `${Math.floor(musicStats.avgDuration / 60)}:${String(musicStats.avgDuration % 60).padStart(2, '0')}`} loading={false} tooltipDescription="Average duration of your favorite songs" />
        <StatCard icon={Palette} title="Unique Genres" value={!musicStats ? "—" : `${musicStats.uniqueGenres}`} loading={false} tooltipDescription="Number of unique genres in your library" />
        <StatCard icon={Calendar} title="Average Year" value={!musicStats ? "—" : `~${musicStats.avgYear}`} loading={false} tooltipDescription="Average year of release of your favorite songs" />
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4 overflow-auto max-h-[900px]">
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <IconSubtitle icon={Users} title="Top Artists" small />
          {artistsData?.items && artistsData.items.length > 0 ? (
            <div className="grid grid-cols-5 gap-4 overflow-auto max-h-[600px]">
              {artistsData.items.map((artist) => <ArtistMiniCard key={artist.id} artist={artist} />)}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-12">No artists available</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <IconSubtitle icon={Calendar} title="Tracks by Decade" subtitle="Distribution of your favorite songs by decade" small />
          {decadeData.length > 0 ? (
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
          <IconSubtitle icon={Palette} title="Top Genres" subtitle="Your top 8 favorite genres" small />
          {genreData.length > 0 ? (
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