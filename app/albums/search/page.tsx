"use client";

import { Search } from "lucide-react";
import { useAlbumSearch } from "@/hooks/use-album-search";
import IconTitle from "@/components/icon-title";
import { AlbumList } from "@/components/album-list";
import LoadingComponent from "@/components/loading-component";
import CustomAlertComponent from "@/components/custom-alert-component";
import ViewHint from "@/components/view-hint";
import SearchBar from "@/components/search-bar";

export default function AlbumsSearchPage() {
  const { query, setQuery, albums, loading, error, isSearching } = useAlbumSearch();

  return (
    <div className="p-6 space-y-6">
      <IconTitle icon={Search} title="Albums Search" subtitle="Search for your favorite albums and view their details, release date and track count" />
      <SearchBar value={query} onChange={setQuery} placeholder="Search for an album..." />

      { !loading && !error && albums.length > 0 && <AlbumList albums={albums} /> }

      { loading && <LoadingComponent message="Searching your favorite albums..." /> }
      { error && <CustomAlertComponent title="Oops! Something went wrong" description={error} variant="destructive" /> }
      { !loading && !error && isSearching && albums.length === 0 && <CustomAlertComponent title="No albums found" description="Try with another search term" /> }
      { !loading && !error && !isSearching && <ViewHint title="Search your favorite albums" description="Write the name of an album to start searching" icon={Search} /> }
    </div>
  );
}