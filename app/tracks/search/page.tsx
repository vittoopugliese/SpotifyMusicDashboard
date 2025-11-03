"use client";

import { Search } from "lucide-react";
import { useTrackSearch } from "@/hooks/use-track-search";
import IconTitle from "@/components/icon-title";
import TrackCard from "@/components/track-card";
import LoadingComponent from "@/components/loading-component";
import CustomAlertComponent from "@/components/custom-alert-component";
import ViewHint from "@/components/view-hint";
import SearchBar from "@/components/search-bar";

export default function TracksSearchPage() {
  const { query, setQuery, tracks, loading, error, isSearching } = useTrackSearch();

  return (
    <div className="p-6 space-y-6">
      <IconTitle icon={Search} title="Track Search" subtitle="Search for your favorite tracks and view their details, duration and popularity" />

      <SearchBar value={query} onChange={setQuery} placeholder="Search for a track..." />

      {!loading && !error && tracks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {tracks.map((track) => <TrackCard key={track.id} track={track} /> )}
        </div>
      )}

      { loading && <LoadingComponent message="Searching your favorite tracks..." /> }
      { error && <CustomAlertComponent title="Oops! Something went wrong" description={error} variant="destructive" /> }
      { !loading && !error && isSearching && tracks.length === 0 && <CustomAlertComponent title="No tracks found" description="Try with another search term" /> }
      { !loading && !error && !isSearching && <ViewHint title="Search your favorite tracks" description="Write the name of a track to start searching" icon={Search} /> }
    </div>
  );
}

