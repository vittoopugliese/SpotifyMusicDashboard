import { Music2, Clock, TrendingUp } from "lucide-react";
import { SpotifyTrack } from "@/lib/spotify";
import Image from "next/image";
import Link from "next/link";
import { formatDuration } from "@/lib/utils";

export default function TrackCard({ track }: { track: SpotifyTrack }) {
  return (
    <Link href={`/tracks/${track.id}`} style={{ userSelect: "none" }}>
      <div className="group bg-card border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 hover:scale-[1.01] cursor-pointer hover:bg-muted/50">
        <div className="relative aspect-square bg-muted">
          {track.album.images.length > 0 ? (
            <Image src={track.album.images[0]?.url || ""} alt={track.name} fill draggable={false} className="object-cover group-hover:scale-105 transition-transform duration-200" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Music2 className="h-16 w-16 text-muted-foreground" />
            </div>
          )}
        </div>

        <div className="p-4 h-[180px] flex flex-col justify-between">
          <div className="flex flex-col gap-1">
            <h3 className="font-semibold text-lg truncate group-hover:text-primary transition-colors" title={track.name}>{track.name}</h3>
            <p className="text-sm text-muted-foreground truncate" title={track.artists.map((a) => a.name).join(", ")}>{track.artists.map((a) => a.name).join(", ")}</p>
            <p className="text-xs text-muted-foreground truncate mt-1" title={track.album.name}>{track.album.name}</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
              <div className="bg-primary h-full rounded-full transition-all duration-300" style={{ width: `${track.popularity}%` }} />
            </div>

            <span className="text-xs text-muted-foreground min-w-[2rem] text-right">{track.popularity}%</span>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{formatDuration(track.duration_ms)}</span>
            <span className="flex items-center gap-1"><TrendingUp className="h-3.5 w-3.5" />Popularity</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

