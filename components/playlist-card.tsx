import { Music2, Users, Lock, Globe } from "lucide-react";
import { SpotifyPlaylist } from "@/lib/spotify";
import Link from "next/link";
import Image from "next/image";

export default function PlaylistCard({ playlist }: { playlist: SpotifyPlaylist }) {
  return (
    <Link href={`/playlists/${playlist.id}`} style={{ userSelect: "none" }} className="cursor-pointer">
      <div className="group bg-card border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer hover:bg-muted/50">
        <div className="relative aspect-square bg-muted">
          {playlist.images.length > 0 ? (
            <Image src={playlist.images[1]?.url || playlist.images[0]?.url || ""} alt={playlist.name} draggable={false}
              className="object-cover transition-transform duration-200 w-full h-full" width={500} height={500} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Music2 className="h-16 w-16 text-muted-foreground" />
            </div>
          )}
        </div>

        <div className="p-4 h-[150px] flex flex-col justify-between">
          <div className="flex flex-col gap-1">
            <h3 className="font-semibold text-lg truncate group-hover:text-primary transition-colors" title={playlist.name}>{playlist.name}</h3>
            <p className="text-sm text-muted-foreground truncate" title={playlist.owner.display_name}>{playlist.owner.display_name}</p>
            { playlist.description && <p className="text-xs text-muted-foreground line-clamp-1" title={playlist.description}>{playlist.description}</p> }
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {playlist.public ? <Globe className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
              </div>
              <div className="flex items-center gap-1">
                <Music2 className="h-4 w-4" />
                <span>{playlist.tracks.total} tracks</span>
              </div>
            </div>
            {playlist.followers && (
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{playlist.followers.total.toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}