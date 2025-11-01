"use client";

import { use } from "react";
import { useTrackProfile } from "@/hooks/use-track-profile";
import { TrackList } from "@/components/track-list";
import { Button } from "@/components/ui/button";
import { Music2, Clock, TrendingUp, ExternalLink, Disc, Calendar, Sparkles } from "lucide-react";
import { TrackProfileSkeleton } from "@/components/page-skeletons/track-profile-skeleton";
import { TechnicalInfo } from "@/components/technical-info";
import { formatDuration, yearFromDate } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import CustomAlertComponent from "@/components/custom-alert-component";
import CustomAvatarComponent from "@/components/custom-avatar-component";

type TrackPageProps = {
  params: Promise<{ id: string }>;
};

export default function TrackProfilePage({ params }: TrackPageProps) {
  const { id } = use(params);
  const { track, audioFeatures, recommendations, isLoading, error } = useTrackProfile(id);

  if (isLoading) return <TrackProfileSkeleton />;
  if (error || !track) return <CustomAlertComponent variant="destructive" title="Error" description={error || "Failed to load track profile"} className="m-6" />;

  return (
    <div className="min-h-screen">
      <div className="relative h-[400px] md:h-[500px] bg-gradient-to-b from-primary/20 to-background overflow-hidden">
        {track.album.images[0]?.url && (
          <div className="absolute inset-0 opacity-30">
            <Image src={track.album.images[0].url} alt={track.name} fill className="object-cover blur-xl" priority draggable={false} />
          </div>
        )}
        
        <div className="relative h-full max-w-7xl mx-auto px-6 flex items-end pb-8">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 w-full">
            <CustomAvatarComponent image={track.album.images[0]?.url} name={track.album.name} className="h-48 w-48 md:h-64 md:w-64 border-2 border-background shadow-2xl rounded-lg" />

            <div className="flex-1 text-center md:text-left space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Track</p>
                <h1 className="text-3xl md:text-5xl font-bold mb-2">{track.name}</h1>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-4">
                  {track.artists.map((artist, index) => (
                    <div key={artist.id} className="flex items-center gap-2">
                      <Link href={`/artists/${artist.id}`} className="text-lg md:text-xl text-muted-foreground hover:text-foreground transition-colors">{artist.name}</Link>
                      {index < track.artists.length - 1 && <span className="text-muted-foreground">x</span>}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="font-semibold">{formatDuration(track.duration_ms)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  <span className="font-semibold">Popularity: {track.popularity}/100</span>
                </div>
                <div className="flex items-center gap-2">
                  <Disc className="h-4 w-4" />
                  <Link href={`/artists/${track.artists[0]?.id}`} className="font-semibold hover:underline">{track.album.name}</Link>
                </div>
                {track.album.release_date && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span className="font-semibold">{yearFromDate(track.album.release_date)}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-3 justify-center md:justify-start pt-2">
                <Button asChild size="lg">
                  <a href={track.external_urls.spotify} target="_blank" rel="noopener noreferrer" className="gap-2" >
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
        {audioFeatures && (
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Sparkles className="h-6 w-6" />Audio Features</h2>
            <TechnicalInfo track={track} audioFeatures={audioFeatures} />
          </section>
        )}

        {recommendations.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Music2 className="h-6 w-6" />Recommended Tracks</h2>
            <TrackList tracks={recommendations.slice(0, 10)} />
          </section>
        )}
      </div>
    </div>
  );
}

