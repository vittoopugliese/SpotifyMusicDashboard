"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useArtistSearch } from "@/hooks/use-artist-search";
import IconTitle from "@/components/icon-title";
import ArtistCard from "@/components/artist-card";
import LoadingComponent from "@/components/loading-component";
import CustomAlertComponent from "@/components/custom-alert-component";

export default function ArtistsSearchPage() {
  const { query, setQuery, artists, loading, error, isSearching } = useArtistSearch();

  return (
    <div className="p-6 space-y-6">
      <IconTitle icon={Search} title="Artists Search" subtitle="Search for your favorite artists and view their follower count, main genres and popularity" />
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input type="text" placeholder="Search for an artist..." value={query} onChange={(e) => setQuery(e.target.value)} className="pl-10 w-full h-11" draggable={false} />
      </div>

      { !loading && !error && artists.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {artists.map(artist => <ArtistCard key={artist.id} artist={artist} />)}
        </div>
      )}

      { loading && <LoadingComponent message="Searching your favorite artists..." size={9} />}
      { error && <CustomAlertComponent title="Oops! Something went wrong" description={error} variant="destructive" /> }
      { !loading && !error && isSearching && artists.length === 0 && <CustomAlertComponent title="No artists found" description="Try with another search term" /> }
      { !loading && !error && !isSearching && <CustomAlertComponent title="Search your favorite artists" description="Write the name of an artist to start searching" /> }
    </div>
  );
}
