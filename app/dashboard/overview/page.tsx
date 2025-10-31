"use client";

import { useTopArtists, useTopTracks } from "@/hooks/use-spotify-data";
import { average, getDominantGenre, getGenreDistribution, yearFromDate } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Music2, TrendingUp, Clock, CalendarDays, Users, Disc3, Music, UserIcon } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";
import { useMemo } from "react";
import InsightCard from "@/components/insight-card";
import { useState } from "react";
import TitleWithPeriodSelector from "@/components/title-with-period-selector";
import { Spinner } from "@/components/ui/spinner";
import { useSpotifySession } from "@/contexts/spotify-session-context";
import SummaryCard from "@/components/summary-card";

const COLORS = ["#1DB954", "#1ed760", "#19e68c", "#15d4a8", "#12c2c1"];

function formatMs(ms: number): string {
  const totalSeconds = Math.round(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export default function OverviewPage() {
  const [timeRange, setTimeRange] = useState<"short_term" | "medium_term" | "long_term">("medium_term");
  const { data: artistsData, loading: artistsLoading } = useTopArtists(timeRange);
  const { data: tracksData, loading: tracksLoading } = useTopTracks(timeRange);
  const { session, loading: sessionLoading } = useSpotifySession();
  
  const isLoading = sessionLoading || artistsLoading || tracksLoading;

  const avgPopularity = useMemo(() => {
    if (!tracksData?.items?.length) return 0;
    return Math.round(average(tracksData.items.map((t) => t.popularity)));
  }, [tracksData]);

  const avgDurationMs = useMemo(() => {
    if (!tracksData?.items?.length) return 0;
    return Math.round(average(tracksData.items.map((t) => t.duration_ms)));
  }, [tracksData]);

  const mostCommonYear = useMemo(() => {
    if (!tracksData?.items?.length) return null;
    const years = tracksData.items.map((t) => yearFromDate(t.album.release_date));
    const counts: Record<number, number> = {};
    for (const y of years) counts[y] = (counts[y] || 0) + 1;
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return Number(sorted[0][0]);
  }, [tracksData]);

  const latestYear = useMemo(() => {
    if (!tracksData?.items?.length) return null;
    return Math.max(...tracksData.items.map((t) => yearFromDate(t.album.release_date)));
  }, [tracksData]);

  const topTrack = useMemo(() => {
    if (!tracksData?.items?.length) return null;
    return [...tracksData.items].sort((a, b) => b.popularity - a.popularity)[0];
  }, [tracksData]);

  const dominantGenre = useMemo(() => {
    if (!artistsData?.items) return "Unknown";
    return getDominantGenre(artistsData.items);
  }, [artistsData]);

  const genreDistribution = useMemo(() => {
    if (!artistsData?.items) return [];
    return getGenreDistribution(artistsData.items, 5);
  }, [artistsData]);

  const totalArtists = artistsData?.total || 0;
  const topArtists = artistsData?.items?.slice(0, 10) || [];

  // Prepare data for charts
  const genreChartData = genreDistribution.map((g, i) => ({ name: g.genre, value: g.count, fill: COLORS[i % COLORS.length]}));

  // Timeline activity (last 10 tracks with release dates)
  const timelineData = useMemo(() => {
    if (!tracksData?.items) return [];
    return tracksData.items.slice(0, 10).map((track) => ({ date: yearFromDate(track.album.release_date), name: track.name })).reverse();
  }, [tracksData]);

  const insight = useMemo(() => {
    if (isLoading || !tracksData?.items?.length) return null;
    const year = mostCommonYear ?? latestYear ?? "";
    const top = topTrack?.name ?? "";
    return `Your favorite music is around ${year} and your most popular song is "${top}". Average popularity ${(avgPopularity).toFixed(0)} and average duration ${formatMs(avgDurationMs)}.`;
  }, [isLoading, tracksData, mostCommonYear, latestYear, topTrack, avgPopularity, avgDurationMs]);

  return (
    <div className="p-6 space-y-6">
      <TitleWithPeriodSelector title="Dashboard Overview" subtitle="Overview of your Spotify listening activity" icon={Music} value={timeRange} onChange={setTimeRange} className="mb-4" />

      <div className="bg-card border border-border rounded-lg p-6 shadow-sm flex items-center justify-between">
        {session.authenticated && session.profile ? <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14">
            <AvatarImage src={session.profile.images?.[0]?.url} alt={session.profile.display_name || "User"} />
            <AvatarFallback className="font-bold">{(session.profile.display_name || "U").charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-lg font-semibold">{session.profile.display_name || "Spotify User"}</span>
            {session.profile.email ? (
              <span className="text-sm text-muted-foreground">{session.profile.email}</span>
            ) : null}
          </div>
        </div> : (
          <div className="flex items-center gap-4">
            <Spinner className="size-12" />
            <div className="flex flex-row items-center gap-2">
              <UserIcon className="h-8 w-8" />
              <span className="text-lg font-semibold">Loading Spotify User...</span>
            </div>
          </div>
        )}
      </div>
      <div className="bg-gradient-to-br from-primary/20 via-primary/10 to-background border border-border rounded-xl p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <Music2 className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Listening Summary</h1>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mt-6">
            <SummaryCard icon={Clock} title="Average Duration" value={formatMs(avgDurationMs)} description="of your favorite songs" tooltipDescription="Average duration of your favorite songs in the selected period" />
            <SummaryCard icon={TrendingUp} title="Average Popularity" value={avgPopularity} description="from 0 to 100" tooltipDescription="Average popularity of your songs in Spotify" />
            <SummaryCard icon={CalendarDays} title="Most Common Year" value={mostCommonYear ?? latestYear ?? "-"} description="of your releases" tooltipDescription="Most common year of release among your favorite songs" />
            <SummaryCard icon={Users} title="Unique Artists" value={totalArtists} description="in your top" tooltipDescription="Total number of unique artists in your top artists" />
            <SummaryCard icon={Music2} title="Dominant Genre" value={dominantGenre.charAt(0).toUpperCase() + dominantGenre.slice(1)} description="of your artists" tooltipDescription="Most frequent genre among your favorite artists" />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Disc3 className="h-5 w-5" />Genre Distribution (Top 5)</h3>
          {isLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : genreChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={genreChartData} cx="50%" cy="50%" labelLine={false} label outerRadius={80} fill="#8884d8" dataKey="value">
                  {genreChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} /> )}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted-foreground text-center py-12">No data available</p>
          )}
        </div>

        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><TrendingUp className="h-5 w-5" />Recent Musical Activity</h3>
          {isLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : timelineData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={timelineData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="date" stroke="#1DB954" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted-foreground text-center py-12">No data available</p>
          )}
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Users className="h-5 w-5" />Top 10 Artists</h3>
        {isLoading ? (
          <div className="flex gap-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <Skeleton className="h-20 w-20 rounded-full" />
            <Skeleton className="h-20 w-20 rounded-full" />
          </div>
        ) : topArtists.length > 0 ? (
          <div className="flex flex-wrap gap-6 justify-center">
            {topArtists.map((artist) => (
              <div key={artist.id} className="flex flex-col items-center gap-2 hover:scale-105 transition-all duration-300">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={artist.images[0]?.url} alt={artist.name} draggable={false} />
                  <AvatarFallback>{artist.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <p className="text-sm font-medium text-center max-w-[100px] truncate">{artist.name}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">No artists available</p>
        )}
      </div>

      <InsightCard insight={insight} loading={isLoading} />
    </div>
  );
}
