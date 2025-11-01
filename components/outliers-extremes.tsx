import { SpotifyTrack } from "@/lib/spotify";
import { formatDuration } from "@/lib/utils";
import { Clock, TrendingUp, TrendingDown, Music2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import IconSubtitle from "@/components/icon-subtitle";

type OutliersExtremesProps = {
  longest: SpotifyTrack;
  shortest: SpotifyTrack;
  mostPopular: SpotifyTrack;
  leastPopular: SpotifyTrack;
};

type TrackCardProps = {
  track: SpotifyTrack;
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
};

function TrackCard({ track, label, value, icon, color }: TrackCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 mb-3">
        <div className={`p-2 rounded-lg ${color}`}>
          {icon}
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-sm font-semibold">{value}</p>
        </div>
      </div>

      <div className="flex gap-3">
        <Avatar className="w-12 h-12 rounded-md">
          <AvatarImage src={track.album.images[0]?.url} alt={track.name} />
          <AvatarFallback><Music2 className="w-6 h-6" /></AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{track.name}</p>
          <p className="text-xs text-muted-foreground truncate">
            {track.artists.map((a) => a.name).join(", ")}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function OutliersExtremes({ longest, shortest, mostPopular, leastPopular }: OutliersExtremesProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <IconSubtitle 
        icon={TrendingUp} 
        title="Outliers & Extremes" 
        subtitle="The most remarkable tracks in this playlist" 
        small 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <TrackCard
          track={longest}
          label="Longest Track"
          value={formatDuration(longest.duration_ms)}
          icon={<Clock className="w-4 h-4 text-primary" />}
          color="bg-primary/10"
        />

        <TrackCard
          track={shortest}
          label="Shortest Track"
          value={formatDuration(shortest.duration_ms)}
          icon={<Clock className="w-4 h-4 text-chart-2" />}
          color="bg-chart-2/10"
        />

        <TrackCard
          track={mostPopular}
          label="Most Popular"
          value={`${mostPopular.popularity}/100`}
          icon={<TrendingUp className="w-4 h-4 text-green-500" />}
          color="bg-green-500/10"
        />

        <TrackCard
          track={leastPopular}
          label="Hidden Gem"
          value={`${leastPopular.popularity}/100`}
          icon={<TrendingDown className="w-4 h-4 text-orange-500" />}
          color="bg-orange-500/10"
        />
      </div>
    </div>
  );
}

