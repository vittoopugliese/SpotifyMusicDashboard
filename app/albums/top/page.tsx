"use client";

import LoadingComponent from "@/components/loading-component";
import CustomAlertComponent from "@/components/custom-alert-component";
import TitleWithPeriodSelector from "@/components/title-with-period-selector";
import { Disc } from "lucide-react";
import { useTopAlbums } from "@/hooks/use-top-albums";
import { AlbumList } from "@/components/album-list";
import { AlbumListSkeleton } from "@/components/page-skeletons/album-list-skeleton";

export default function AlbumsTopPage() {
  const { timeRange, setTimeRange, albums, isLoading, error } = useTopAlbums();

  return (
    <div className="p-6 space-y-6">
      <TitleWithPeriodSelector value={timeRange} onChange={setTimeRange} icon={Disc} title="Your Top Albums" subtitle="Visualize your top albums from your most played tracks" />
      { !isLoading && !error && albums.length > 0 && <AlbumList albums={albums} /> }
      { isLoading && <AlbumListSkeleton /> }
      { error && <CustomAlertComponent variant="destructive" title="Error" description={error} /> }
      { !isLoading && !error && albums.length === 0 && <CustomAlertComponent variant="default" title="No albums found" description="We couldn't find any top albums for the selected time range." /> }
    </div>
  );
}

