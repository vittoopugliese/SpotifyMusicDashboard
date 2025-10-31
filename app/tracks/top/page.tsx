"use client";

import LoadingComponent from "@/components/loading-component";
import CustomAlertComponent from "@/components/custom-alert-component";
import TitleWithPeriodSelector from "@/components/title-with-period-selector";
import { Music2 } from "lucide-react";
import { useTopTracks } from "@/hooks/use-top-tracks";
import { TrackList } from "@/components/track-list";

export default function TracksTopPage() {
  const { timeRange, setTimeRange, tracks, isLoading, error } = useTopTracks();

  return (
    <div className="p-6 space-y-6">
      <TitleWithPeriodSelector value={timeRange} onChange={setTimeRange} icon={Music2} title="Your Top Tracks" subtitle="Visualize your top tracks and their audio features" />
      { !isLoading && !error && tracks.length > 0 && <TrackList tracks={tracks} /> }
      { isLoading && <LoadingComponent message="Loading your top tracks..." />}
      { error && <CustomAlertComponent variant="destructive" title="Error" description={error} /> }
      { !isLoading && !error && tracks.length === 0 && <CustomAlertComponent variant="default" title="No tracks found" description="We couldn't find any top tracks for the selected time range." /> }
    </div>
  );
}
