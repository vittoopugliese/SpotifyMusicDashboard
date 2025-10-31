"use client";

import IconTitle from "@/components/icon-title";
import { Input } from "@/components/ui/input";
import { Search, Music2 } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import ArtistCard from "@/components/artist-card";
import { useArtistSearch } from "@/hooks/use-artist-search";

export default function ArtistsSearchPage() {
  const { query, setQuery, artists, loading, error, isSearching } = useArtistSearch();

  return (
    <div className="p-6 space-y-6">
      <IconTitle icon={<Search className="h-8 w-8" />} title="Artists Search" />
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input type="text" placeholder="Busca un artista..." value={query} onChange={(e) => setQuery(e.target.value)} className="pl-10 w-full" />
      </div>

      {loading && (
        <div className="flex items-center flex-col justify-center py-12">
          <Spinner className="size-9" />
          <p className="text-sm text-muted-foreground">Searching artists...</p>
        </div>
      )}

      {error && <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-destructive">{error}</div>}

      {!loading && !error && artists.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {artists.map(artist => <ArtistCard key={artist.id} artist={artist} />)}
        </div>
      )}

      {!loading && !error && isSearching && artists.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <Music2 className="h-16 w-16 mb-4" />
          <p className="text-lg">No artists found</p>
          <p className="text-sm">Try with another search term</p>
        </div>
      )}

      {!loading && !error && !isSearching && (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <Search className="h-16 w-16 mb-4" />
          <p className="text-lg mb-1 font-bold">Search your favorite artists</p>
          <p className="text-sm">Write the name of an artist to start searching</p>
        </div>
      )}
    </div>
  );
}
