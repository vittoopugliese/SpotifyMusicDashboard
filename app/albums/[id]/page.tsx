"use client";

import { use } from "react";
import { useAlbumProfile } from "@/hooks/use-album-profile";
import { Music2 } from "lucide-react";
import { AlbumProfileSkeleton } from "@/components/page-skeletons/album-profile-skeleton";
import { TrackList } from "@/components/track-list";
import ProfileHero, { ProfileType } from "@/components/profile-hero";
import CustomAlertComponent from "@/components/custom-alert-component";
import IconSubtitle from "@/components/icon-subtitle";

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
      <ProfileHero type={ProfileType.Album} data={album} totalDuration={totalDuration} />

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        {tracks.length > 0 && (
          <section>
            <IconSubtitle icon={Music2} title="Album Tracks" subtitle="Click one to view more information" />
            <TrackList tracks={tracks} albumImage={album.images[0]?.url} albumName={album.name} />
          </section>
        )}
      </div>
    </div>
  );
}
