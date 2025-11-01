"use client";

import Link from "next/link";
import CustomAlertComponent from "@/components/custom-alert-component";
import { use } from "react";
import { useAlbumProfile } from "@/hooks/use-album-profile";
import { Disc, Calendar, Music2 } from "lucide-react";
import { AlbumProfileSkeleton } from "@/components/page-skeletons/album-profile-skeleton";
import { formatDuration, yearFromDate } from "@/lib/utils";
import IconSubtitle from "@/components/icon-subtitle";
import ProfileHero from "@/components/profile-hero";

type AlbumPageProps = {
  params: Promise<{ id: string }>;
};

export default function AlbumProfilePage({ params }: AlbumPageProps) {
  const { id } = use(params);
  const { album, tracks, isLoading, error } = useAlbumProfile(id);

  if (isLoading) return <AlbumProfileSkeleton />;
  if (error || !album) return <CustomAlertComponent variant="destructive" title="Error" description={error || "Failed to load album profile"} className="m-6" />;

  const totalDuration = tracks.reduce((sum, track) => sum + track.duration_ms, 0);

  return (
    <div className="min-h-screen">
      <ProfileHero
        backgroundImage={album.images[0]?.url}
        avatarImage={album.images[0]?.url}
        avatarName={album.name}
        profileType={album.album_type}
        title={album.name}
        spotifyUrl={album.external_urls.spotify}
        roundedAvatar={false}
        metadata={
          <>
            {album.release_date && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="font-semibold">{yearFromDate(album.release_date)}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Music2 className="h-4 w-4" />
              <span className="font-semibold">{album.total_tracks} tracks</span>
            </div>
            {totalDuration > 0 && (
              <div className="flex items-center gap-2">
                <Disc className="h-4 w-4" />
                <span className="font-semibold">{formatDuration(totalDuration)} total</span>
              </div>
            )}
          </>
        }
      >
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-4">
          {album.artists?.map((artist, index) => (
            <div key={artist.id} className="flex items-center gap-2">
              <Link href={`/artists/${artist.id}`} className="text-lg md:text-xl text-muted-foreground hover:text-foreground transition-colors">{artist.name}</Link>
              {index < (album.artists?.length || 0) - 1 && <span className="text-muted-foreground">x</span>}
            </div>
          ))}
        </div>
      </ProfileHero>

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        {tracks.length > 0 && (
          <section>
            <IconSubtitle icon={Music2} title="Album Tracks" subtitle="Click one to view more information" />
            {/* <TrackList tracks={tracks} /> */}
          </section>
        )}
      </div>
    </div>
  );
}
