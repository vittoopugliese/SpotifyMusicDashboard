import { SpotifyTrack } from "@/lib/spotify";
import CustomAvatarComponent from "./custom-avatar-component";
import Link from "next/link";

type TrackCardProps = {
  track: SpotifyTrack;
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
};

export default function TrackStatCard({ track, label, value, icon, color }: TrackCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 mb-3">
        <div className={`p-2 rounded-lg ${color}`}>{icon}</div>
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-sm font-semibold">{value}</p>
        </div>
      </div>

      <Link href={`/tracks/${track.id}`} className="flex gap-3 bg-muted/50 rounded-md p-2">
        <CustomAvatarComponent className="w-12 h-12 rounded-md" image={track.album.images[0]?.url} name={track.name} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{track.name}</p>
          <p className="text-xs text-muted-foreground truncate">{track.artists.map((a) => a.name).join(", ")}</p>
        </div>
      </Link>
    </div>
  );
};