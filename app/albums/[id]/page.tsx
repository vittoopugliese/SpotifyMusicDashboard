"use client";

import Link from "next/link";
import Image from "next/image";
import CustomAlertComponent from "@/components/custom-alert-component";
import { use } from "react";
import { useAlbumProfile } from "@/hooks/use-album-profile";
import { TrackList } from "@/components/track-list";
import { Button } from "@/components/ui/button";
import { Disc, Calendar, Music2, ExternalLink } from "lucide-react";
import { AlbumProfileSkeleton } from "@/components/page-skeletons/album-profile-skeleton";
import { formatDuration, yearFromDate } from "@/lib/utils";

type AlbumPageProps = {
  params: Promise<{ id: string }>;
};

export default function AlbumProfilePage({ params }: AlbumPageProps) {
  const { id } = use(params);
  const { album, tracks, isLoading, error } = useAlbumProfile(id);

  if (isLoading) return <AlbumProfileSkeleton />;
  if (error || !album) return <CustomAlertComponent variant="destructive" title="Error" description={error || "Failed to load album profile"} className="m-4" />;

  const totalDuration = tracks.reduce((sum, track) => sum + track.duration_ms, 0);

  return (
    <div className="min-h-screen">
      <div className="relative h-[400px] md:h-[500px] bg-gradient-to-b from-primary/20 to-background overflow-hidden">
        {album.images[0]?.url && (
          <div className="absolute inset-0 opacity-30">
            <Image src={album.images[0].url} alt={album.name} fill className="object-cover blur-xl" priority draggable={false} />
          </div>
        )}
        
        <div className="relative h-full max-w-7xl mx-auto px-6 flex items-end pb-8">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 w-full">
            <div className="relative">
              <div className="h-48 w-48 md:h-64 md:w-64 rounded-lg border-4 border-background shadow-2xl overflow-hidden bg-muted">
                <Image src={album.images[0]?.url || "/placeholder.png"} alt={album.name} width={256} height={256} className="object-cover w-full h-full" priority draggable={false} />
              </div>
            </div>

            <div className="flex-1 text-center md:text-left space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2 capitalize">{album.album_type}</p>
                <h1 className="text-3xl md:text-5xl font-bold mb-2">{album.name}</h1>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-4">
                  {album.artists?.map((artist, index) => (
                    <div key={artist.id} className="flex items-center gap-2">
                      <Link href={`/artists/${artist.id}`} className="text-lg md:text-xl text-muted-foreground hover:text-foreground transition-colors">
                        {artist.name}
                      </Link>
                      {index < (album.artists?.length || 0) - 1 && <span className="text-muted-foreground">,</span>}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm">
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
              </div>

              <div className="flex gap-3 justify-center md:justify-start pt-2">
                <Button asChild size="lg">
                  <a href={album.external_urls.spotify} target="_blank" rel="noopener noreferrer" className="gap-2">
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
            <div>
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><Music2 className="h-6 w-6" />Tracks</h2>
              <p className="text-sm text-muted-foreground mb-6">Click one to view more information</p>
            </div>
            {/* <TrackList tracks={tracks} /> */}
          </section>
        )}
      </div>
    </div>
  );
}
