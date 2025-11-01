"use client";

import { use } from "react";
import { useTrackProfile } from "@/hooks/use-track-profile";
import { TrackProfileSkeleton } from "@/components/page-skeletons/track-profile-skeleton";
import { Music2 } from "lucide-react";
import ProfileHero, { ProfileType } from "@/components/profile-hero";
import CustomAlertComponent from "@/components/custom-alert-component";
import IconSubtitle from "@/components/icon-subtitle";

type TrackPageProps = {
  params: Promise<{ id: string }>;
};

export default function TrackProfilePage({ params }: TrackPageProps) {
  const { id } = use(params);
  const { track, isLoading, error } = useTrackProfile(id);

  if (isLoading) return <TrackProfileSkeleton />;
  if (error || !track) return <CustomAlertComponent variant="destructive" title="Error" description={error || "Failed to load track profile"} className="m-6" />;

  return (
    <div className="min-h-screen">
      <ProfileHero type={ProfileType.Track} data={track} />

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-8">
        <section>
          <IconSubtitle icon={Music2} title="Play Track" subtitle="Listen a preview below" />
          <div className="border rounded-lg overflow-hidden bg-card">
            <div className="p-6">
              <iframe width="100%" height="152" allowFullScreen title={`Spotify player for ${track.name}`} 
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" 
                src={`https://open.spotify.com/embed/track/${track.id}?utm_source=generator`}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}