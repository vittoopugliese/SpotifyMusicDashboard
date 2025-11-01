"use client";

import { use } from "react";
import { useTrackProfile } from "@/hooks/use-track-profile";
import { TrackList } from "@/components/track-list";
import { Music2, Sparkles } from "lucide-react";
import { TrackProfileSkeleton } from "@/components/page-skeletons/track-profile-skeleton";
import { TechnicalInfo } from "@/components/technical-info";
import ProfileHero, { ProfileType } from "@/components/profile-hero";
import CustomAlertComponent from "@/components/custom-alert-component";

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
      <ProfileHero type={ProfileType.Track} data={track} />

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

