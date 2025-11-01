"use client";

import { use } from "react";
import { useArtistProfile } from "@/hooks/use-artist-profile";
import CustomAlertComponent from "@/components/custom-alert-component";
import { TrackList } from "@/components/track-list";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Music2, Users, TrendingUp, ExternalLink, Disc, Calendar } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { ArtistProfileSkeleton } from "@/components/page-skeletons/artist-profile-skeleton";

type ArtistPageProps = {
  params: Promise<{ id: string }>;
};

export default function ArtistProfilePage({ params }: ArtistPageProps) {
  const { id } = use(params);
  const { artist, topTracks, albums, relatedArtists, isLoading, error } = useArtistProfile(id);

  if (isLoading) return <ArtistProfileSkeleton />
  if (error || !artist) return <CustomAlertComponent variant="destructive" title="Error" description={error || "Failed to load artist profile"} />

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[400px] md:h-[500px] bg-gradient-to-b from-primary/20 to-background overflow-hidden">
        {artist.images[0]?.url && (
          <div className="absolute inset-0 opacity-30">
            <Image src={artist.images[0].url} alt={artist.name} fill className="object-cover blur-xl" priority draggable={false} />
          </div>
        )}
        
        <div className="relative h-full max-w-7xl mx-auto px-6 flex items-end pb-8">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 w-full">
            {/* Artist Image */}
            <div className="relative">
              <Avatar className="h-48 w-48 md:h-64 md:w-64 border-4 border-background shadow-2xl">
                <AvatarImage src={artist.images[0]?.url} alt={artist.name} draggable={false} />
                <AvatarFallback className="text-6xl">
                  <Music2 className="h-24 w-24" />
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Artist Info */}
            <div className="flex-1 text-center md:text-left space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Artist</p>
                <h1 className="text-4xl md:text-6xl font-bold mb-4">{artist.name}</h1>
              </div>

              {/* Stats */}
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

              {/* Genres */}
              {artist.genres && artist.genres.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  {artist.genres.slice(0, 5).map((genre) => (
                    <Badge key={genre} variant="secondary" className="text-xs">
                      {genre}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 justify-center md:justify-start pt-2">
                <Button asChild size="lg">
                  <a
                    href={artist.external_urls.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gap-2"
                  >
                    <ExternalLink className="h-5 w-5" />
                    Open in Spotify
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        {/* Top Tracks */}
        {topTracks.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Music2 className="h-6 w-6" />
              Popular Tracks
            </h2>
            <TrackList tracks={topTracks.slice(0, 10)} />
          </section>
        )}

        {/* Albums */}
        {albums.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Disc className="h-6 w-6" />
              Albums & Singles
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {albums.map((album) => (
                <a key={album.id} href={album.external_urls.spotify} target="_blank" rel="noopener noreferrer" className="group" >
                  <div className="bg-card rounded-lg overflow-hidden border hover:shadow-lg transition-all">
                    <div className="relative aspect-square bg-muted">
                      <Image src={album.images[0]?.url || "/placeholder.png"} alt={album.name} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw" className="object-cover group-hover:scale-105 transition-transform duration-300" draggable={false} />
                    </div>
                    <div className="p-3">
                      <p className="font-semibold text-sm line-clamp-1" title={album.name}>{album.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(album.release_date).getFullYear()}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 capitalize">{album.album_type} • {album.total_tracks} tracks</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Related Artists */}
        {relatedArtists.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Users className="h-6 w-6" />
              Related Artists
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {relatedArtists.map((relatedArtist) => (
                <Link
                  key={relatedArtist.id}
                  href={`/artists/${relatedArtist.id}`}
                  className="group"
                >
                  <div className="bg-card rounded-lg p-4 hover:bg-muted/50 transition-colors text-center">
                    <Avatar className="h-24 w-24 mx-auto mb-3 ring-2 ring-transparent group-hover:ring-primary transition-all">
                      <AvatarImage src={relatedArtist.images[0]?.url} alt={relatedArtist.name} draggable={false} />
                      <AvatarFallback>
                        <Music2 className="h-12 w-12" />
                      </AvatarFallback>
                    </Avatar>
                    <p className="font-semibold truncate" title={relatedArtist.name}>
                      {relatedArtist.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {relatedArtist.genres[0] || "Artist"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

