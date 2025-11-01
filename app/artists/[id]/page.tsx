"use client";

import { use } from "react";
import { useArtistProfile } from "@/hooks/use-artist-profile";
import { TrackList } from "@/components/track-list";
import { AlbumCard } from "@/components/album-card";
import { Music2, Disc } from "lucide-react";
import { ArtistProfileSkeleton } from "@/components/page-skeletons/artist-profile-skeleton";
import ProfileHero, { ProfileType } from "@/components/profile-hero";
import CustomAlertComponent from "@/components/custom-alert-component";
import IconSubtitle from "@/components/icon-subtitle";
import { AlbumList } from "@/components/album-list";

type ArtistPageProps = {
  params: Promise<{ id: string }>;
};

export default function ArtistProfilePage({ params }: ArtistPageProps) {
  const { id } = use(params);
  const { artist, topTracks, albums, isLoading, error } = useArtistProfile(id);

  if (isLoading) return <ArtistProfileSkeleton />
  if (error || !artist) return <CustomAlertComponent variant="destructive" title="Error" description={error || "Failed to load artist profile"} className="m-6" />

  return (
    <div className="min-h-screen">
      <ProfileHero type={ProfileType.Artist} data={artist} />

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-12">
        {topTracks.length > 0 && (
          <section>
            <IconSubtitle icon={Music2} title="Popular Tracks" subtitle="Click one to view more information" />
            <TrackList tracks={topTracks.slice(0, 10)} />
          </section>
        )}

        {albums.length > 0 && (
          <section>
            <IconSubtitle icon={Disc} title="Albums & Singles" subtitle="Click one to view more information" />
            <AlbumList albums={albums} />
          </section>
        )}
      </div>
    </div>
  );
}