"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { usePlaylistSearch } from "@/hooks/use-playlist-search";
import IconTitle from "@/components/icon-title";
import PlaylistCard from "@/components/playlist-card";
import LoadingComponent from "@/components/loading-component";
import CustomAlertComponent from "@/components/custom-alert-component";
import ViewHint from "@/components/view-hint";

export default function PlaylistsSearchPage() {
  const { query, setQuery, playlists, loading, error, isSearching } = usePlaylistSearch();

  return (
    <div className="p-6 space-y-6">
      <IconTitle 
        icon={Search} 
        title="Playlists Search" 
        subtitle="Search for playlists and view their details" 
      />
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          type="text" 
          placeholder="Search for a playlist..." 
          value={query} 
          onChange={(e) => setQuery(e.target.value)} 
          className="pl-10 w-full h-11" 
          draggable={false} 
        />
      </div>

      {!loading && !error && playlists.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {playlists.map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </div>
      )}

      {loading && <LoadingComponent message="Searching playlists..." />}
      
      {error && (
        <CustomAlertComponent 
          title="Oops! Something went wrong" 
          description={error} 
          variant="destructive" 
        />
      )}
      
      {!loading && !error && isSearching && playlists.length === 0 && (
        <CustomAlertComponent 
          title="No playlists found" 
          description="Try with another search term" 
        />
      )}
      
      {!loading && !error && !isSearching && (
        <ViewHint 
          title="Search playlists" 
          description="Write the name of a playlist to start searching" 
          icon={Search} 
        />
      )}
    </div>
  );
}

