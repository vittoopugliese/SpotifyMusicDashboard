"use client";

import { useState } from "react";
import { SpotifyArtist } from "@/lib/spotify";
import { Button } from "@/components/ui/button";
import { X, Plus, Music2 } from "lucide-react";
import { useArtistSearch } from "@/hooks/use-artist-search";
import { Spinner } from "./ui/spinner";
import Image from "next/image";
import SearchBar from "@/components/search-bar";

interface ArtistSelectorProps {
  selectedArtists: SpotifyArtist[];
  onAddArtist: (artist: SpotifyArtist) => void;
  onRemoveArtist: (artistId: string) => void;
  canAddMore: boolean;
  maxArtists?: number;
}

export default function ArtistSelector({ selectedArtists, onAddArtist, onRemoveArtist, canAddMore, maxArtists = 3 }: ArtistSelectorProps) {
  const [showSearch, setShowSearch] = useState(selectedArtists.length === 0);
  const { query, setQuery, artists, loading } = useArtistSearch({ limit: 10 });

  const handleSelectArtist = (artist: SpotifyArtist) => {
    onAddArtist(artist);
    setQuery("");
    if (selectedArtists.length + 1 >= maxArtists) setShowSearch(false);
  };

  const isArtistSelected = (artistId: string) => {
    return selectedArtists.some(a => a.id === artistId);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        {selectedArtists.map((artist, index) => (
          <div key={artist.id} className="flex items-center gap-2 bg-card border rounded-lg p-2 pr-3 hover:shadow-md transition-shadow">
            <div className="relative w-12 h-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
              {artist.images.length > 0 ? (
                <Image src={artist.images[0]?.url || ""} alt={artist.name} fill className="object-cover" sizes="48px" draggable={false}/>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Music2 className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{artist.name}</p>
              <p className="text-xs text-muted-foreground">Artist {index + 1}</p>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0" onClick={() => onRemoveArtist(artist.id)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}

        {canAddMore && !showSearch && (
          <button onClick={() => setShowSearch(true)} className="flex items-center justify-center gap-2 bg-card border-2 border-dashed rounded-lg p-4 hover:border-primary hover:bg-accent transition-colors cursor-pointer min-w-[200px]">
            <Plus className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Add Artist</span>
          </button>
        )}
      </div>

      {showSearch && canAddMore && (
        <div className="border rounded-lg p-4 space-y-3 bg-card">
          <div className="flex items-center gap-2">
            <SearchBar value={query} onChange={setQuery} placeholder="Search for an artist..." className="flex-1" />
            {selectedArtists.length > 0 && <Button variant="outline" onClick={() => setShowSearch(false)}>Cancel</Button>}
          </div>

          {loading && (
            <div className="flex items-center flex-col justify-center py-8">
              <Spinner className="size-9" />
              <p className="text-sm text-muted-foreground mt-3">Searching for artists...</p>
            </div>
          )}

          {!loading && artists.length > 0 && (
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {artists.map((artist) => {
                const selected = isArtistSelected(artist.id);
                return (
                  <button key={artist.id} onClick={() => !selected && handleSelectArtist(artist)} disabled={selected} className={`w-full flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors ${selected ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}>
                    <div className="relative w-12 h-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
                      {artist.images.length > 0 ? (
                        <Image src={artist.images[0]?.url || ""} alt={artist.name} fill className="object-cover" sizes="48px" draggable={false} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Music2 className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <p className="font-semibold text-sm truncate">{artist.name}</p>
                      {artist.genres.length > 0 && (
                        <p className="text-xs text-muted-foreground truncate">{artist.genres.slice(0, 2).join(", ")}</p>
                      )}
                    </div>
                    {selected && (
                      <span className="text-xs text-muted-foreground flex-shrink-0">Selected</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {!loading && query && artists.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Music2 className="h-12 w-12 mb-2" />
              <p className="text-sm">No artists found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

