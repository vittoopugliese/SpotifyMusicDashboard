"use client";

import { use } from "react";
import { TrackList } from "@/components/track-list";
import { usePlaylistProfile } from "@/hooks/use-playlist-profile";
import { PlaylistProfileSkeleton } from "@/components/page-skeletons/playlist-profile-skeleton";
import { Music2, Users, Globe, Lock } from "lucide-react";
import IconSubtitle from "@/components/icon-subtitle";
import CustomAlertComponent from "@/components/custom-alert-component";
import ProfileHero from "@/components/profile-hero";

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
      <ProfileHero backgroundImage={playlist.images[0]?.url} avatarImage={playlist.images[0]?.url} avatarName={playlist.name} profileType="Playlist"
        title={playlist.name} spotifyUrl={playlist.external_urls.spotify} roundedAvatar={false}
        metadata={
          <>
            <div className="flex items-center gap-2">
              <Music2 className="h-4 w-4" />
              <span className="font-semibold">{tracks.length} {tracks.length === 1 ? "track" : "tracks"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="font-semibold">{playlist.followers?.total.toLocaleString()} {playlist.followers?.total === 1 ? "follower" : "followers"}</span>
            </div>
            <div className="flex items-center gap-2">
              {playlist.public ? (
                <>
                  <Globe className="h-4 w-4" />
                  <span className="font-semibold">Public</span>
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  <span className="font-semibold">Private</span>
                </>
              )}
            </div>
          </>
        }
      >
        {playlist.description && <p className="text-muted-foreground mb-4 max-w-2xl mx-auto md:mx-0">{playlist.description}</p>}
        <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-muted-foreground">
          <span>By</span>
          <span className="font-semibold text-foreground">{playlist.owner.display_name}</span>
        </div>
      </ProfileHero>

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
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

