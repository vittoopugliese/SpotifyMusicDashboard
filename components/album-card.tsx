"use client";

import Image from "next/image";
import { Calendar } from "lucide-react";
import { SpotifyAlbum } from "@/lib/spotify";

type AlbumCardProps = {
  album: SpotifyAlbum;
};

export function AlbumCard({ album }: AlbumCardProps) {
  return (
    <a href={album.external_urls.spotify} target="_blank" rel="noopener noreferrer" className="group" >
      <div className="bg-card rounded-lg overflow-hidden border hover:shadow-lg transition-all">
        <div className="relative aspect-square bg-muted">
          <Image src={album.images[0]?.url || "/placeholder.png"} alt={album.name} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw" className="object-cover group-hover:scale-105 transition-transform duration-300" draggable={false} />
        </div>
        <div className="p-3">
          <p className="font-semibold text-sm line-clamp-1" title={album.name}>
            {album.name}
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
            <Calendar className="h-3 w-3" />
            <span>{new Date(album.release_date).getFullYear()}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 capitalize">
            {album.album_type} • {album.total_tracks} tracks
          </p>
        </div>
      </div>
    </a>
  );
}

