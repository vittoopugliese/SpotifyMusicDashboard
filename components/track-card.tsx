import { Clock, TrendingUp } from "lucide-react";
import { SpotifyTrack } from "@/lib/spotify";
import Image from "next/image";
import Link from "next/link";
import { formatDuration } from "@/lib/utils";

export default function TrackCard({ track, index, albumImage, albumName }: { track: SpotifyTrack, index?: number, albumImage?: string, albumName?: string }) {
  return (
    <Link href={`/tracks/${track.id}`} style={{ userSelect: "none" }}>
      <div className="bg-card rounded-lg border overflow-hidden hover:shadow-lg transition-all cursor-pointer hover:bg-muted/50">
        <div className="relative aspect-square bg-muted">
          <Image src={albumImage || track.album?.images[0]?.url || ''} alt={track.name} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px" className="object-cover" draggable={false} />
          {index !== undefined && <div className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm rounded-full h-10 w-10 flex items-center justify-center border shadow-lg z-10">
            <span className="text-lg font-bold">{index + 1}</span>
          </div>}
        </div>

        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-base line-clamp-1 mb-1" title={track.name}>{track.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-1" title={track.artists.map((a) => a.name).join(", ")}>{track.artists.map((a) => a.name).join(", ")}</p>
            <p className="text-xs text-muted-foreground line-clamp-1 mt-1" title={albumName || track.album?.name}>{albumName || track.album?.name}</p>
          </div>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{formatDuration(track.duration_ms)}</span>
            <span className="flex items-center gap-1"><TrendingUp className="h-3.5 w-3.5" />{track.popularity}/100</span>
          </div>
        </div>
      </div>
    </Link>
  );
}