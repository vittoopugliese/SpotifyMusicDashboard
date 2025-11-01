"use client";

import { use } from "react";
import { TrackList } from "@/components/track-list";
import { usePlaylistProfile } from "@/hooks/use-playlist-profile";
import { PlaylistProfileSkeleton } from "@/components/page-skeletons/playlist-profile-skeleton";
import { Music2 } from "lucide-react";
import ProfileHero, { ProfileType } from "@/components/profile-hero";
import IconSubtitle from "@/components/icon-subtitle";
import CustomAlertComponent from "@/components/custom-alert-component";

type PlaylistPageProps = {
  params: Promise<{ id: string }>;
};

export default function PlaylistProfilePage({ params }: PlaylistPageProps) {
  const { id } = use(params);
  const { playlist, tracks, isLoading, error } = usePlaylistProfile(id);

  if (isLoading) return <PlaylistProfileSkeleton />;
  if (error || !playlist) return <CustomAlertComponent variant="destructive" title="Error" description={error || "Failed to load playlist profile"} className="m-6" />;
  
  return (
    <div className="min-h-screen">
      <ProfileHero type={ProfileType.Playlist} data={playlist} tracksCount={tracks.length} />

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-12">
        {tracks.length > 0 && (
          <section>
            <IconSubtitle icon={Music2} title="Playlist Tracks" subtitle={`Click any of the ${tracks.length} tracks to view more information`} />
            <TrackList tracks={tracks} />
          </section>
        )}

        { tracks.length === 0 && <CustomAlertComponent title="No tracks found" description="This playlist appears to be empty or the tracks could not be loaded." /> }
      </div>
    </div>
  );
}