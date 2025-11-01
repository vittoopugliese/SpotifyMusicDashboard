"use client";

import { Button } from "@/components/ui/button";
import { Play, Search } from "lucide-react";
import { useUserPlaylists } from "@/hooks/use-user-playlists";
import IconTitle from "@/components/icon-title";
import PlaylistCard from "@/components/playlist-card";
import LoadingComponent from "@/components/loading-component";
import CustomAlertComponent from "@/components/custom-alert-component";
import Link from "next/link";
import ViewHint from "@/components/view-hint";

export default function PlaylistsYoursPage() {
  const { playlists, isLoading, error } = useUserPlaylists();

  const searchButton = (
    <Button asChild variant="outline">
      <Link href="/playlists/search" className="gap-2">
        <Search className="h-4 w-4" />
        Search Playlists
      </Link>
    </Button>
  );

  return (
    <div className="p-6 space-y-6">
      <IconTitle icon={Play} title="Your Playlists" subtitle="View your playlists and their contents" action={searchButton} />
      
      { isLoading && <LoadingComponent message="Loading your playlists..." /> }
      
      { error && <CustomAlertComponent title="Oops! Something went wrong" description={error} variant="destructive" /> }
      
      { !isLoading && !error && playlists.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          { playlists.map((playlist) => <PlaylistCard key={playlist.id} playlist={playlist} /> ) }
        </div>
      )}
      
      { !isLoading && !error && playlists.length === 0 && <ViewHint title="No playlists found" description="You don't have any playlists yet. Create one on Spotify or search for existing playlists!" icon={Play} /> }
    </div>
  );
}
