"use client";

import { use } from "react";
import { Badge } from "@/components/ui/badge";
import { useArtistProfile } from "@/hooks/use-artist-profile";
import { TrackList } from "@/components/track-list";
import { AlbumCard } from "@/components/album-card";
import { Music2, Users, TrendingUp, Disc } from "lucide-react";
import { ArtistProfileSkeleton } from "@/components/page-skeletons/artist-profile-skeleton";
import CustomAlertComponent from "@/components/custom-alert-component";
import IconSubtitle from "@/components/icon-subtitle";
import ProfileHero from "@/components/profile-hero";

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
      <ProfileHero
        backgroundImage={artist.images[0]?.url}
        avatarImage={artist.images[0]?.url}
        avatarName={artist.name}
        profileType="Artist"
        title={artist.name}
        spotifyUrl={artist.external_urls.spotify}
        roundedAvatar={true}
        metadata={
          <>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="font-semibold">
                {artist.followers?.total.toLocaleString()} followers
              </span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="font-semibold">Popularity: {artist.popularity}/100</span>
            </div>
          </>
        }
      >
        {artist.genres && artist.genres.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
            {artist.genres.slice(0, 5).map((genre) => <Badge key={genre} variant="secondary" className="text-xs">{genre}</Badge>)}
          </div>
        )}
      </ProfileHero>

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        {topTracks.length > 0 && (
          <section>
            <IconSubtitle icon={Music2} title="Popular Tracks" subtitle="Click one to view more information" />
            <TrackList tracks={topTracks.slice(0, 10)} />
          </section>
        )}

        {albums.length > 0 && (
          <section>
            <IconSubtitle icon={Disc} title="Albums & Singles" subtitle="Click one to view more information" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {albums.map(album => <AlbumCard key={album.id} album={album} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}