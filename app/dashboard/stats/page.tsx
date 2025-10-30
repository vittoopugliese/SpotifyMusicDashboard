"use client";

import { useState, useMemo } from "react";
import { useTopArtists, useTopTracks, useAudioFeatures } from "@/hooks/use-spotify-data";
import { average, yearFromDate, getMusicalMood } from "@/lib/spotify";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line, } from "recharts";
import { Download, Music2, BarChart3, Activity, Gauge, Heart, Waves } from "lucide-react";
import StatCard from "@/components/stat-card";
import TitleWithPeriodSelector from "@/components/title-with-period-selector";
import { TrackRow } from "@/components/track-row";

type TimeRange = "short_term" | "medium_term" | "long_term";

export default function StatsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("medium_term");
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  const { data: artistsData, loading: artistsLoading } = useTopArtists(timeRange);
  const { data: tracksData, loading: tracksLoading } = useTopTracks(timeRange);
  
  const trackIds = tracksData?.items?.map((t) => t.id) || [];
  const { data: audioFeaturesData, loading: audioLoading } = useAudioFeatures(trackIds || []);

  const isLoading = artistsLoading || tracksLoading || audioLoading;

  // Audio Personality Radar Chart Data
  const radarData = useMemo(() => {
    if (!audioFeaturesData?.audio_features || audioFeaturesData.audio_features.length === 0) return null;

    const features = audioFeaturesData.audio_features.filter((f) => f != null);
    const avgEnergy = average(features.map((f) => f.energy));
    const avgDanceability = average(features.map((f) => f.danceability));
    const avgAcousticness = average(features.map((f) => f.acousticness));
    const avgValence = average(features.map((f) => f.valence));
    const avgSpeechiness = average(features.map((f) => f.speechiness));

    const globalAverages = { energy: 0.65, danceability: 0.60, acousticness: 0.25, valence: 0.55, speechiness: 0.08, };

    return [
      { subject: "Energy", personal: avgEnergy, global: globalAverages.energy, fullMark: 1, },
      { subject: "Danceability", personal: avgDanceability, global: globalAverages.danceability, fullMark: 1, },
      { subject: "Acousticness", personal: avgAcousticness, global: globalAverages.acousticness, fullMark: 1, },
      { subject: "Valence", personal: avgValence, global: globalAverages.valence, fullMark: 1, },
      { subject: "Speechiness", personal: avgSpeechiness, global: globalAverages.speechiness, fullMark: 1, },
    ];
  }, [audioFeaturesData]);

  const featureSummary = useMemo(() => {
    if (!audioFeaturesData?.audio_features || audioFeaturesData.audio_features.length === 0) return null;
    const features = audioFeaturesData.audio_features.filter((f) => f != null);
    const avgEnergy = average(features.map((f) => f.energy));
    const avgDanceability = average(features.map((f) => f.danceability));
    const avgValence = average(features.map((f) => f.valence));
    const avgTempo = average(features.map((f) => f.tempo));
    return { avgEnergy, avgDanceability, avgValence, avgTempo, };
  }, [audioFeaturesData]);

  // Tracks by Decade
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

  // Mood Evolution Over Time (simplified - using track position as time proxy)
  const moodEvolution = useMemo(() => {
    if (!tracksData?.items || tracksData.items.length === 0 || !audioFeaturesData?.audio_features || audioFeaturesData.audio_features.length === 0) return [];

    const featuresMap = new Map(audioFeaturesData.audio_features.map((f) => [f.id, f]));

    return tracksData.items.slice(0, 20)
      .map((track, index) => {
        const feature = featuresMap.get(track.id);
        return { track: index + 1, mood: feature ? getMusicalMood(feature.valence) : "Balanced", valence: feature?.valence || 0, };
      }).filter((d) => d.valence > 0);
  }, [tracksData, audioFeaturesData]);

  const handlePlay = (trackId: string) => {
    const track = tracksData?.items.find((t) => t.id === trackId);
    if (!track?.preview_url) return;

    if (playingTrackId === trackId && audioElement) {
      audioElement.pause();
      setPlayingTrackId(null);
      setAudioElement(null);
      return;
    }

    // Stop current playback
    if (audioElement) audioElement.pause();

    // Start new playback
    const audio = new Audio(track.preview_url);
    audio.play();
    audio.onended = () => {
      setPlayingTrackId(null);
      setAudioElement(null);
    };
    setPlayingTrackId(trackId);
    setAudioElement(audio);
  };

  const handleExportStats = () => {
    const stats = {
      timeRange,
      totalArtists: artistsData?.total || 0,
      totalTracks: tracksData?.total || 0,
      audioPersonality: radarData,
      topArtists: artistsData?.items?.slice(0, 10) || [],
      topTracks: tracksData?.items?.slice(0, 10) || [],
      decadeDistribution: decadeData,
      moodEvolution: moodEvolution,
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
      <TitleWithPeriodSelector title="Your Stats" icon={<BarChart3 className="h-8 w-8" />} value={timeRange} onChange={setTimeRange} className="mb-4"
        actions={<Button variant="outline" onClick={handleExportStats} className="gap-2"><Download className="h-4 w-4" />Export Stats</Button>} />

      {/* Audio Personality Radar Chart */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><Music2 className="h-5 w-5" />Audio Personality</h2>
        {isLoading ? (
          <Skeleton className="h-96 w-full" />
        ) : radarData ? (
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={90} domain={[0, 1]} />
              <Radar name="Your Music" dataKey="personal" stroke="#1DB954" fill="#1DB954" fillOpacity={0.6} />
              <Radar name="Global Average" dataKey="global" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-muted-foreground text-center py-12">No data available</p>
        )}
      </div>

      {/* Audio Feature Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Activity} title="Energy" value={isLoading || !featureSummary ? "—" : `${Math.round(featureSummary.avgEnergy * 100)}%`} loading={isLoading} />
        <StatCard icon={Waves} title="Danceability" value={isLoading || !featureSummary ? "—" : `${Math.round(featureSummary.avgDanceability * 100)}%`} loading={isLoading} />
        <StatCard icon={Heart} title="Valence" value={isLoading || !featureSummary ? "—" : `${Math.round(featureSummary.avgValence * 100)}%`} loading={isLoading} />
        <StatCard icon={Gauge} title="Avg Tempo" value={isLoading || !featureSummary ? "—" : `${Math.round(featureSummary.avgTempo)} BPM`} loading={isLoading} />
      </div>

      {/* Top Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Tracks Table */}
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Top 50 Tracks</h2>
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : tracksData?.items && tracksData.items.length > 0 ? (
            <div className="overflow-auto max-h-[600px]">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-sm text-muted-foreground">
                    <th className="p-3">#</th>
                    <th className="p-3">Track</th>
                    <th className="p-3">Album</th>
                    <th className="p-3">Duration</th>
                    <th className="p-3">Preview</th>
                  </tr>
                </thead>
                <tbody>
                  {tracksData.items.slice(0, 50).map((track, index) => <TrackRow key={track.id} track={track} index={index} onPlay={handlePlay} isPlaying={playingTrackId === track.id} />)}
                </tbody>
              </table>
            </div>
          ) : <p className="text-muted-foreground text-center py-12">No tracks available</p>
          }
        </div>

        {/* Top Artists Grid */}
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Top Artists</h2>
          {isLoading ? (
            <div className="grid grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          ) : artistsData?.items && artistsData.items.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 overflow-auto max-h-[600px]">
              {artistsData.items.map((artist) => (
                <div key={artist.id} className="bg-muted/50 rounded-lg p-4 hover:bg-muted transition-colors" >
                  <Avatar className="h-24 w-24 mx-auto mb-3">
                    <AvatarImage src={artist.images[0]?.url} alt={artist.name} />
                    <AvatarFallback className="text-lg">{artist.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <p className="text-center font-medium truncate">{artist.name}</p>
                  <p className="text-center text-sm text-muted-foreground">{artist.genres[0] || "Unknown"}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-12">No artists available</p>
          )}
        </div>
      </div>

      {/* Listening Patterns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tracks by Decade */}
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Canciones por Década</h2>
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

        {/* Mood Evolution */}
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Mood Evolution</h2>
          {isLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : moodEvolution.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={moodEvolution}>
                <XAxis dataKey="track" />
                <YAxis domain={[0, 1]} />
                <Tooltip />
                <Line type="monotone" dataKey="valence" stroke="#1DB954" strokeWidth={2} name="Valence" />
              </LineChart>
            </ResponsiveContainer>
          ) : <p className="text-muted-foreground text-center py-12">No data available</p>}
        </div>
      </div>
    </div>
  );
}
