"use client";

import Image from "next/image";
import CustomAlertComponent from "@/components/custom-alert-component";
import { use } from "react";
import { Badge } from "@/components/ui/badge";
import { useArtistProfile } from "@/hooks/use-artist-profile";
import { TrackList } from "@/components/track-list";
import { AlbumCard } from "@/components/album-card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Music2, Users, TrendingUp, ExternalLink, Disc } from "lucide-react";
import { ArtistProfileSkeleton } from "@/components/page-skeletons/artist-profile-skeleton";

type ArtistPageProps = {
  params: Promise<{ id: string }>;
};

export default function ArtistProfilePage({ params }: ArtistPageProps) {
  const { id } = use(params);
  const { artist, topTracks, albums, isLoading, error } = useArtistProfile(id);

  if (isLoading) return <ArtistProfileSkeleton />
  if (error || !artist) return <CustomAlertComponent variant="destructive" title="Error" description={error || "Failed to load artist profile"} />

  return (
    <div className="min-h-screen">
      <div className="relative h-[400px] md:h-[500px] bg-gradient-to-b from-primary/20 to-background overflow-hidden">
        {artist.images[0]?.url && (
          <div className="absolute inset-0 opacity-30">
            <Image src={artist.images[0].url} alt={artist.name} fill className="object-cover blur-xl" priority draggable={false} />
          </div>
        )}
        
        <div className="relative h-full max-w-7xl mx-auto px-6 flex items-end pb-8">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 w-full">
            <div className="relative">
              <Avatar className="h-48 w-48 md:h-64 md:w-64 border-4 border-background shadow-2xl">
                <AvatarImage src={artist.images[0]?.url} alt={artist.name} draggable={false} />
                <AvatarFallback className="text-6xl">
                  <Music2 className="h-24 w-24" />
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="flex-1 text-center md:text-left space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Artist</p>
                <h1 className="text-4xl md:text-6xl font-bold mb-4">{artist.name}</h1>
              </div>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm">
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
              </div>

              {artist.genres && artist.genres.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  {artist.genres.slice(0, 5).map((genre) => (
                    <Badge key={genre} variant="secondary" className="text-xs">
                      {genre}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex gap-3 justify-center md:justify-start pt-2">
                <Button asChild size="lg">
                  <a href={artist.external_urls.spotify} target="_blank" rel="noopener noreferrer" className="gap-2">
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
        {topTracks.length > 0 && (
          <section>
            <div>
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><Music2 className="h-6 w-6" />Popular Tracks</h2>
              <p className="text-sm text-muted-foreground mb-6">Click one to view more information</p>
            </div>
            <TrackList tracks={topTracks.slice(0, 10)} />
          </section>
        )}

        {albums.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Disc className="h-6 w-6" />Albums & Singles</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {albums.map(album => <AlbumCard key={album.id} album={album} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}