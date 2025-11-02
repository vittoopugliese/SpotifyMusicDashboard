import { SpotifyPlaylist } from "@/lib/spotify";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Music2, Clock, Calendar, User, LucideIcon } from "lucide-react";
import { formatDuration } from "@/lib/utils";

type PlaylistOverviewCardProps = {
  playlist: SpotifyPlaylist;
  totalDuration: number;
  trackCount: number;
};

const PlaylistStat = ({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Icon className="w-5 h-5 text-primary" />
        <p className="text-md text-muted-foreground">{label}</p>
      </div>
        <p className="text-lg font-semibold">{value}</p>
    </div>
  );
};

export default function PlaylistOverviewCard({ playlist, totalDuration, trackCount }: PlaylistOverviewCardProps) {
  const coverImage = playlist.images?.[0]?.url || "";

  return (
    <div className="bg-gradient-to-br from-primary/20 via-primary/10 to-background border border-border rounded-xl p-6 shadow-lg">
      <div className="flex flex-col md:flex-row gap-6">

        <div className="flex-shrink-0">
          <Avatar className="w-48 h-48 rounded-lg shadow-xl">
            <AvatarImage src={coverImage} alt={playlist.name} className="object-cover" />
            <AvatarFallback className="rounded-lg text-4xl">
              <Music2 className="w-20 h-20" />
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex-1 space-y-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{playlist.name}</h1>
            {playlist.description && <p className="text-muted-foreground text-sm line-clamp-2" dangerouslySetInnerHTML={{ __html: playlist.description }} /> }
          </div>

          <div className="flex flex-wrap">
            {playlist.public !== undefined && <Badge variant={playlist.public ? "default" : "secondary"}>{playlist.public ? "Public" : "Private"}</Badge> }
            {playlist.collaborative && <Badge variant="outline">Collaborative</Badge>}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <PlaylistStat icon={Music2} label="Tracks" value={trackCount.toString()} />
            <PlaylistStat icon={Clock} label="Duration" value={formatDuration(totalDuration)} />
            <PlaylistStat icon={User} label="Creator" value={playlist.owner?.display_name || "Unknown"} />
            <PlaylistStat icon={Calendar} label="Followers" value={playlist.followers?.total?.toLocaleString() || "0"} />
          </div>
        </div>
      </div>
    </div>
  );
}