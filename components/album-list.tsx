"use client";

import { SpotifyAlbum } from "@/lib/spotify";
import { AlbumCard } from "./album-card";

type AlbumListProps = {
  albums: SpotifyAlbum[];
};

export function AlbumList({ albums }: AlbumListProps) {
  return (
    <>
      {/* Desktop View - Grid */}
      <div className="hidden xl:block">
        <div className="grid grid-col`s-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {albums.map((album) => <AlbumCard key={album.id} album={album} /> )}
        </div>
      </div>

      {/* Mobile/Tablet View - Grid */}
      <div className="xl:hidden grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {albums.map((album) => <AlbumCard key={album.id} album={album} /> )}
      </div>
    </>
  );
}

