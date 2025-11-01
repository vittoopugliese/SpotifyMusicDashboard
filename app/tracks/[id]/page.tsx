"use client";

import { use } from "react";
import { useTrackProfile } from "@/hooks/use-track-profile";
import { TrackProfileSkeleton } from "@/components/page-skeletons/track-profile-skeleton";
import ProfileHero, { ProfileType } from "@/components/profile-hero";
import CustomAlertComponent from "@/components/custom-alert-component";

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
    </div>
  );
}