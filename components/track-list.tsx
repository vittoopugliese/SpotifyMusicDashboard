"use client";

import Image from "next/image";
import { Music2, Clock, TrendingUp } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { SpotifyTrack } from "@/lib/spotify";
import { formatDuration } from "@/lib/utils";
import { useRouter } from "next/navigation";

type TrackListProps = {
  tracks: SpotifyTrack[];
};

export function TrackList({ tracks }: TrackListProps) {
  const router = useRouter();
  return (
    <>
      {/* Desktop View - Table */}
      <div className="hidden xl:block bg-card rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="p-3 text-left text-sm font-medium w-12">#</th>
                <th className="p-3 text-left text-sm font-medium min-w-[250px]">Track</th>
                <th className="p-3 text-left text-sm font-medium min-w-[200px]">Album</th>
                <th className="p-3 text-left text-sm font-medium w-20 text-center">Duration</th>
                <th className="p-3 text-left text-sm font-medium w-24 text-center">Popularity</th>
              </tr>
            </thead>
            <tbody>
              {tracks.map((track, index) => (
                <tr key={track.id} className="border-b hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => router.push(`/tracks/${track.id}`)}>
                  <td className="p-3 text-muted-foreground font-medium">{index + 1}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar className="h-12 w-12 rounded flex-shrink-0">
                        <AvatarImage src={track.album.images[0]?.url} alt={track.name} draggable={false} />
                        <AvatarFallback><Music2 className="h-6 w-6" /></AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate" title={track.name}>{track.name}</p>
                        <p className="text-sm text-muted-foreground truncate" title={track.artists.map((a) => a.name).join(", ")}>
                          {track.artists.map((a) => a.name).join(", ")}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-muted-foreground">
                    <p className="truncate" title={track.album.name}>{track.album.name}</p>
                  </td>
                  <td className="p-3 text-muted-foreground text-center text-sm">
                    {formatDuration(track.duration_ms)}
                  </td>
                  <td className="p-3 text-muted-foreground text-center">
                    <span className="inline-flex items-center gap-1 text-sm">{track.popularity}/100</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile/Tablet View - Cards */}
      <div className="xl:hidden grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tracks.map((track, index) => (
          <div key={track.id} className="bg-card rounded-lg border overflow-hidden hover:shadow-lg transition-all cursor-pointer hover:bg-muted/50" onClick={() => router.push(`/tracks/${track.id}`)}>
            <div className="relative aspect-square bg-muted">
              <Image src={track.album.images[0]?.url || "/placeholder.png"} alt={track.name} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px" className="object-cover" draggable={false} />
              <div className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm rounded-full h-10 w-10 flex items-center justify-center border shadow-lg z-10">
                <span className="text-lg font-bold">{index + 1}</span>
              </div>
            </div>

            <div className="p-4 space-y-3">
              <div>
                <h3 className="font-semibold text-base line-clamp-1 mb-1" title={track.name}>{track.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-1" title={track.artists.map((a) => a.name).join(", ")}>{track.artists.map((a) => a.name).join(", ")}</p>
                <p className="text-xs text-muted-foreground line-clamp-1 mt-1" title={track.album.name}>{track.album.name}</p>
              </div>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{formatDuration(track.duration_ms)}</span>
                <span className="flex items-center gap-1"><TrendingUp className="h-3.5 w-3.5" />{track.popularity}/100</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

