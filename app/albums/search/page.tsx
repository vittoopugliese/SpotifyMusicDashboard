"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useAlbumSearch } from "@/hooks/use-album-search";
import IconTitle from "@/components/icon-title";
import { AlbumList } from "@/components/album-list";
import LoadingComponent from "@/components/loading-component";
import CustomAlertComponent from "@/components/custom-alert-component";
import ViewHint from "@/components/view-hint";

export default function AlbumsSearchPage() {
  const { query, setQuery, albums, loading, error, isSearching } = useAlbumSearch();

  return (
    <div className="p-6 space-y-6">
      <IconTitle icon={Search} title="Albums Search" subtitle="Search for your favorite albums and view their details, release date and track count" />

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input type="text" placeholder="Search for an album..." value={query} onChange={(e) => setQuery(e.target.value)} className="pl-10 w-full h-11" draggable={false} />
      </div>

      {!loading && !error && albums.length > 0 && (
        <AlbumList albums={albums} />
      )}

      { loading && <LoadingComponent message="Searching your favorite albums..." /> }
      { error && <CustomAlertComponent title="Oops! Something went wrong" description={error} variant="destructive" /> }
      { !loading && !error && isSearching && albums.length === 0 && <CustomAlertComponent title="No albums found" description="Try with another search term" /> }
      { !loading && !error && !isSearching && <ViewHint title="Search your favorite albums" description="Write the name of an album to start searching" icon={Search} /> }
    </div>
  );
}

