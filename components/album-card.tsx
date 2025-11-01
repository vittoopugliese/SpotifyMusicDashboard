"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { SpotifyAlbum } from "@/lib/spotify";

type AlbumCardProps = {
  album: SpotifyAlbum;
};

export function AlbumCard({ album }: AlbumCardProps) {
  return (
    <Link href={`/albums/${album.id}`} className="group" style={{ userSelect: "none" }}>
      <div className="bg-card rounded-lg overflow-hidden border hover:shadow-lg transition-all cursor-pointer hover:bg-muted/50">
        <div className="relative aspect-square bg-muted">
          <Image src={album.images[0]?.url || "/placeholder.png"} alt={album.name} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw" className="object-cover group-hover:scale-105 transition-transform duration-300" draggable={false} />
        </div>
        <div className="p-3">
          <p className="font-semibold text-sm line-clamp-1" title={album.name}>
            {album.name}
          </p>
          <p className="text-xs text-muted-foreground line-clamp-1 mt-1" title={album.artists?.map((a) => a.name).join(", ")}>
            {album.artists?.map((a) => a.name).join(", ")}
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
    </Link>
  );
}

