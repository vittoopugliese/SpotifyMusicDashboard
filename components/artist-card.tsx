import { Music2, Users } from "lucide-react";
import { SpotifyArtist } from "@/lib/spotify";
import Image from "next/image";

const formatFollowers = (count: number): string => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }

  return count.toString();
};

export default function ArtistCard({artist}: {artist: SpotifyArtist}) {
  return (
    <div className="group bg-card border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer">
      <div className="relative aspect-square bg-muted">
        {artist.images.length > 0 ? (
          <Image src={artist.images[0]?.url || ""} alt={artist.name} fill draggable={false}
            className="object-cover group-hover:scale-105 transition-transform duration-200"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Music2 className="h-16 w-16 text-muted-foreground" />
          </div>
        )}
      </div>

      <div className="p-4 h-[150px] flex flex-col justify-between">
        <div className="flex flex-col gap-1">
            <h3 className="font-semibold text-lg truncate group-hover:text-primary transition-colors">{artist.name}</h3>
            {artist.followers && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{formatFollowers(artist.followers.total)} seguidores</span>
                </div>
            )}
        </div>

          <div className="flex flex-wrap gap-1">
            { artist.genres.length > 0 
                ? artist.genres.slice(0, 2).map((genre, idx) => <span key={idx} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">{genre}</span>)
                : <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">No genres found</span>
            }
            {artist.genres.length > 2 && <span className="text-xs text-muted-foreground px-2 py-1">+{artist.genres.length - 3}</span>}
          </div>

        <div className="flex items-center gap-2">
          <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
            <div className="bg-primary h-full rounded-full transition-all duration-300" style={{width: `${artist.popularity}%`}} />
          </div>

          <span className="text-xs text-muted-foreground min-w-[2rem] text-right">{artist.popularity}%</span>
        </div>
      </div>
    </div>
  );
}
