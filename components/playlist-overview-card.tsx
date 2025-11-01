import { SpotifyPlaylist } from "@/lib/spotify";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Music2, Clock, Calendar, User } from "lucide-react";
import { formatDuration } from "@/lib/utils";

type PlaylistOverviewCardProps = {
  playlist: SpotifyPlaylist;
  totalDuration: number;
  trackCount: number;
};

export default function PlaylistOverviewCard({ playlist, totalDuration, trackCount }: PlaylistOverviewCardProps) {
  const coverImage = playlist.images?.[0]?.url || "";

  return (
    <div className="bg-gradient-to-br from-primary/20 via-primary/10 to-background border border-border rounded-xl p-6 shadow-lg">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Cover Art */}
        <div className="flex-shrink-0">
          <Avatar className="w-48 h-48 rounded-lg shadow-xl">
            <AvatarImage src={coverImage} alt={playlist.name} className="object-cover" />
            <AvatarFallback className="rounded-lg text-4xl">
              <Music2 className="w-20 h-20" />
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Info */}
        <div className="flex-1 space-y-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{playlist.name}</h1>
            {playlist.description && (
              <p className="text-muted-foreground text-sm line-clamp-2" dangerouslySetInnerHTML={{ __html: playlist.description }} />
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {playlist.public !== undefined && (
              <Badge variant={playlist.public ? "default" : "secondary"}>
                {playlist.public ? "Public" : "Private"}
              </Badge>
            )}
            {playlist.collaborative && <Badge variant="outline">Collaborative</Badge>}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Music2 className="w-4 h-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Tracks</p>
                <p className="text-lg font-semibold">{trackCount}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Duration</p>
                <p className="text-lg font-semibold">{formatDuration(totalDuration)}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Creator</p>
                <p className="text-lg font-semibold truncate max-w-[120px]">
                  {playlist.owner?.display_name || "Unknown"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Followers</p>
                <p className="text-lg font-semibold">{playlist.followers?.total?.toLocaleString() || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

