/* eslint-disable @next/next/no-img-element */
"use client";

import { use } from "react";
import { TrackList } from "@/components/track-list";
import { Button } from "@/components/ui/button";
import { usePlaylistProfile } from "@/hooks/use-playlist-profile";
import { PlaylistProfileSkeleton } from "@/components/page-skeletons/playlist-profile-skeleton";
import { Music2, Users, ExternalLink, Globe, Lock } from "lucide-react";
import IconSubtitle from "@/components/icon-subtitle";
import CustomAlertComponent from "@/components/custom-alert-component";
import CustomAvatarComponent from "@/components/custom-avatar-component";

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
      {/* Hero Section */}
      <div className="relative h-[400px] md:h-[500px] bg-gradient-to-b from-primary/20 to-background overflow-hidden">
        {playlist.images[0]?.url && (
          <div className="absolute inset-0 opacity-30">
            <img src={playlist.images[0].url} alt={playlist.name}  className="object-cover blur-xl"  draggable={false} />
          </div>
        )}
        
        <div className="relative h-full max-w-7xl mx-auto px-6 flex items-end pb-8">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 w-full">
            <CustomAvatarComponent image={playlist.images[0]?.url} name={playlist.name} className="h-48 w-48 md:h-64 md:w-64 border-2 border-background shadow-2xl rounded-lg" />

            <div className="flex-1 text-center md:text-left space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Playlist</p>
                <h1 className="text-3xl md:text-5xl font-bold mb-2">{playlist.name}</h1>
                { playlist.description && <p className="text-muted-foreground mb-4 max-w-2xl mx-auto md:mx-0">{playlist.description}</p>  }
                <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-muted-foreground">
                  <span>By</span>
                  <span className="font-semibold text-foreground">{playlist.owner.display_name}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm">
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
              </div>

              <div className="flex gap-3 justify-center md:justify-start pt-2">
                <Button asChild size="lg">
                  <a href={playlist.external_urls.spotify} target="_blank" rel="noopener noreferrer" className="gap-2" >
                    <ExternalLink className="h-5 w-5" />
                    Open in Spotify
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

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

