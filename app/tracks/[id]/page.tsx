"use client";

import { use } from "react";
import { useTrackProfile } from "@/hooks/use-track-profile";
import { TrackList } from "@/components/track-list";
import { Music2, Clock, TrendingUp, Disc, Calendar, Sparkles } from "lucide-react";
import { TrackProfileSkeleton } from "@/components/page-skeletons/track-profile-skeleton";
import { TechnicalInfo } from "@/components/technical-info";
import { formatDuration, yearFromDate } from "@/lib/utils";
import Link from "next/link";
import CustomAlertComponent from "@/components/custom-alert-component";
import ProfileHero from "@/components/profile-hero";

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
      <ProfileHero
        backgroundImage={track.album.images[0]?.url}
        avatarImage={track.album.images[0]?.url}
        avatarName={track.album.name}
        profileType="Track"
        title={track.name}
        spotifyUrl={track.external_urls.spotify}
        roundedAvatar={false}
        metadata={
          <>
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
              <Link href={`/albums/${track.album.id}`} className="font-semibold hover:underline">{track.album.name}</Link>
            </div>
            {track.album.release_date && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="font-semibold">{yearFromDate(track.album.release_date)}</span>
              </div>
            )}
          </>
        }
      >
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-4">
          {track.artists.map((artist, index) => (
            <div key={artist.id} className="flex items-center gap-2">
              <Link href={`/artists/${artist.id}`} className="text-lg md:text-xl text-muted-foreground hover:text-foreground transition-colors">{artist.name}</Link>
              {index < track.artists.length - 1 && <span className="text-muted-foreground">x</span>}
            </div>
          ))}
        </div>
      </ProfileHero>

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

