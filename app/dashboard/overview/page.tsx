"use client";

import { useSpotifyToken } from "@/hooks/use-spotify-token";
import { useTopArtists, useTopTracks, useAudioFeatures } from "@/hooks/use-spotify-data";
import { average, getDominantGenre, getGenreDistribution, getMusicalMood, yearFromDate } from "@/lib/spotify";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Dna, Music2, TrendingUp, Heart, Users, Disc3 } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, } from "recharts";
import { useMemo } from "react";
import StatCard from "@/components/stat-card";
import InsightCard from "@/components/insight-card";
import LoginToGetTokenMessage from "@/components/login-to-get-token";

const COLORS = ["#1DB954", "#1ed760", "#19e68c", "#15d4a8", "#12c2c1"];

function generateDailyInsight( avgValence: number, avgEnergy: number, avgDanceability: number, dominantGenre: string, totalArtists: number ): string {
  const insights = [
    `Tu música tiene un promedio de ${(avgValence * 100).toFixed(0)}% de positividad (valence) y ${(avgEnergy * 100).toFixed(0)}% de energía.`,
    `Tu género dominante es ${dominantGenre}, lo que refleja tus preferencias musicales únicas.`,
    `Has escuchado ${totalArtists} artistas únicos, mostrando una amplia diversidad en tu paleta musical.`,
    `Con ${(avgDanceability * 100).toFixed(0)}% de danceability promedio, tu música tiene un ritmo muy bailable.`,
    `Tu combinación de ${avgValence > 0.5 ? "música positiva" : "música melancólica"} y ${avgEnergy > 0.6 ? "alta energía" : "energía moderada"} crea un perfil único.`,
  ];
  return insights[Math.floor(Math.random() * insights.length)];
}

export default function OverviewPage() {
  const { session, loading: sessionLoading, login } = useSpotifyToken();
  const { data: artistsData, loading: artistsLoading } = useTopArtists("medium_term");
  const { data: tracksData, loading: tracksLoading } = useTopTracks("medium_term");
  
  const trackIds = useMemo(() => tracksData?.items?.map((t) => t.id) || [], [tracksData]);
  const { data: audioFeaturesData, loading: audioLoading } = useAudioFeatures(trackIds);

  const isLoading = sessionLoading || artistsLoading || tracksLoading || audioLoading;

  // Calculate Music DNA (averages)
  const avgValence = useMemo(() => {
    if (!audioFeaturesData?.audio_features) return 0;
    return average(audioFeaturesData.audio_features.map((f) => f.valence).filter((v) => v != null));
  }, [audioFeaturesData]);

  const avgEnergy = useMemo(() => {
    if (!audioFeaturesData?.audio_features) return 0;
    return average(audioFeaturesData.audio_features.map((f) => f.energy).filter((e) => e != null));
  }, [audioFeaturesData]);

  const avgDanceability = useMemo(() => {
    if (!audioFeaturesData?.audio_features) return 0;
    return average(audioFeaturesData.audio_features.map((f) => f.danceability).filter((d) => d != null));
  }, [audioFeaturesData]);

  const avgBPM = useMemo(() => {
    if (!audioFeaturesData?.audio_features) return 0;
    return average(audioFeaturesData.audio_features.map((f) => f.tempo).filter((t) => t != null));
  }, [audioFeaturesData]);

  const dominantGenre = useMemo(() => {
    if (!artistsData?.items) return "Unknown";
    return getDominantGenre(artistsData.items);
  }, [artistsData]);

  const genreDistribution = useMemo(() => {
    if (!artistsData?.items) return [];
    return getGenreDistribution(artistsData.items, 5);
  }, [artistsData]);

  const musicalMood = getMusicalMood(avgValence);
  const totalArtists = artistsData?.total || 0;
  const topArtists = artistsData?.items?.slice(0, 3) || [];

  // Prepare data for charts
  const genreChartData = genreDistribution.map((g, i) => ({ name: g.genre, value: g.count, fill: COLORS[i % COLORS.length]}));

  // Timeline activity (last 10 tracks with release dates)
  const timelineData = useMemo(() => {
    if (!tracksData?.items) return [];
    return tracksData.items.slice(0, 10).map((track) => ({ date: yearFromDate(track.album.release_date), name: track.name })).reverse();
  }, [tracksData]);

  const insight = useMemo(() => {
    if (isLoading || !audioFeaturesData) return null;
    return generateDailyInsight(avgValence, avgEnergy, avgDanceability, dominantGenre, totalArtists);
  }, [avgValence, avgEnergy, avgDanceability, dominantGenre, totalArtists, isLoading, audioFeaturesData]);

  return (
    <div >
      {(!session.authenticated && !isLoading) ? <LoginToGetTokenMessage onLogin={login} /> : (
        <>
        {session.authenticated && session.profile ? (
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14">
                <AvatarImage src={session.profile.images?.[0]?.url} alt={session.profile.display_name || "User"} />
                <AvatarFallback>{(session.profile.display_name || "U").charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-lg font-semibold">{session.profile.display_name || "Spotify User"}</span>
                {session.profile.email ? (
                  <span className="text-sm text-muted-foreground">{session.profile.email}</span>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
        <div className="bg-gradient-to-br from-primary/20 via-primary/10 to-background border border-border rounded-xl p-8 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <Dna className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Your Music DNA</h1>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="bg-card/50 rounded-lg p-4 border border-border/50">
              <p className="text-sm text-muted-foreground mb-2">Valence Promedio</p>
              <p className="text-3xl font-bold text-primary">{avgValence.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground mt-1">Positividad musical</p>
            </div>
            <div className="bg-card/50 rounded-lg p-4 border border-border/50">
              <p className="text-sm text-muted-foreground mb-2">Energy Promedio</p>
              <p className="text-3xl font-bold text-primary">{avgEnergy.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground mt-1">Intensidad musical</p>
            </div>
            <div className="bg-card/50 rounded-lg p-4 border border-border/50">
              <p className="text-sm text-muted-foreground mb-2">Danceability Promedio</p>
              <p className="text-3xl font-bold text-primary">{avgDanceability.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground mt-1">Capacidad de baile</p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} title="Artistas Únicos" value={isLoading ? "..." : totalArtists} loading={isLoading} />
        <StatCard icon={Music2} title="Género Dominante" value={isLoading ? "..." : dominantGenre} loading={isLoading} />
        <StatCard icon={TrendingUp} title="Promedio BPM" value={isLoading ? "..." : `${Math.round(avgBPM)} BPM`} loading={isLoading} />
        <StatCard icon={Heart} title="Humor Musical" value={isLoading ? "..." : musicalMood} loading={isLoading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Disc3 className="h-5 w-5" />
            Distribución de Géneros (Top 5)
          </h3>
          {isLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : genreChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={genreChartData} cx="50%" cy="50%" labelLine={false}
                  // label={(entry: any) => `${entry.name} (${(entry.percent * 100).toFixed(0)}%)`}
                  label
                  outerRadius={80} fill="#8884d8" dataKey="value" >
                  {genreChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} /> )}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted-foreground text-center py-12">No hay datos disponibles</p>
          )}
        </div>

        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Actividad Musical Reciente
          </h3>
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
            <p className="text-muted-foreground text-center py-12">No hay datos disponibles</p>
          )}
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Users className="h-5 w-5" />
          Top 3 Artistas
        </h3>
        {isLoading ? (
          <div className="flex gap-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <Skeleton className="h-20 w-20 rounded-full" />
            <Skeleton className="h-20 w-20 rounded-full" />
          </div>
        ) : topArtists.length > 0 ? (
          <div className="flex gap-6">
            {topArtists.map((artist) => (
              <div key={artist.id} className="flex flex-col items-center gap-2">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={artist.images[0]?.url} alt={artist.name} />
                  <AvatarFallback>{artist.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <p className="text-sm font-medium text-center max-w-[100px] truncate">{artist.name}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">No hay artistas disponibles</p>
        )}
      </div>

      {/* Insight del Dia */}
      <InsightCard insight={insight} loading={isLoading} />
        </>
      )}
    </div>
  );
}
