import { SpotifyTrack } from "@/lib/spotify";
import { formatDuration } from "@/lib/utils";
import { Clock, TrendingUp, TrendingDown } from "lucide-react";
import IconSubtitle from "@/components/icon-subtitle";
import TrackStatCard from "./track-stat-card";

type OutliersExtremesProps = {
  longest: SpotifyTrack;
  shortest: SpotifyTrack;
  mostPopular: SpotifyTrack;
  leastPopular: SpotifyTrack;
};

export default function OutliersExtremes({ longest, shortest, mostPopular, leastPopular, }: OutliersExtremesProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <IconSubtitle icon={TrendingUp} title="Outliers & Extremes" subtitle="The most remarkable tracks in this playlist" small />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <TrackStatCard track={longest} label="Longest Track" value={formatDuration(longest.duration_ms)} icon={<Clock className="w-4 h-4 text-primary" />} color="bg-primary/10" />
        <TrackStatCard track={shortest} label="Shortest Track" value={formatDuration(shortest.duration_ms)} icon={<Clock className="w-4 h-4 text-chart-2" />} color="bg-chart-2/10" />
        <TrackStatCard track={mostPopular} label="Most Popular" value={`${mostPopular.popularity}/100`} icon={<TrendingUp className="w-4 h-4 text-green-500" />} color="bg-green-500/10" />
        <TrackStatCard track={leastPopular} label="Hidden Gem" value={`${leastPopular.popularity}/100`} icon={<TrendingDown className="w-4 h-4 text-orange-500" />} color="bg-orange-500/10" />
      </div>
    </div>
  );
}