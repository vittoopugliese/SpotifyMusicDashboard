"use client";

import LoadingComponent from "@/components/loading-component";
import CustomAlertComponent from "@/components/custom-alert-component";
import TitleWithPeriodSelector from "@/components/title-with-period-selector";
import { Music2 } from "lucide-react";
import { useTopTracks, TrackWithAudioFeatures } from "@/hooks/use-top-tracks";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}:${parseInt(seconds) < 10 ? "0" : ""}${seconds}`;
}

export default function TracksTopPage() {
  const { timeRange, setTimeRange, tracks, isLoading, error } = useTopTracks();

  return (
    <div className="p-6 space-y-6">
      <TitleWithPeriodSelector value={timeRange} onChange={setTimeRange} icon={Music2} title="Your Top Tracks" subtitle="Visualize your top tracks and their audio features" />
      { !isLoading && !error && tracks.length > 0 && <TrackListView tracks={tracks} /> }
      { isLoading && <LoadingComponent message="Loading your top tracks..." />}
      { error && <CustomAlertComponent variant="destructive" title="Error" description={error} /> }
      { !isLoading && !error && tracks.length === 0 && <CustomAlertComponent variant="default" title="No tracks found" description="We couldn't find any top tracks for the selected time range." /> }
    </div>
  );
}

function TrackListView({ tracks }: { tracks: TrackWithAudioFeatures[] }) {
  return (
    <div className="bg-card rounded-lg border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="p-3 text-left text-sm font-medium w-12">#</th>
              <th className="p-3 text-left text-sm font-medium">Track</th>
              <th className="p-3 text-left text-sm font-medium hidden md:table-cell">Album</th>
              <th className="p-3 text-left text-sm font-medium w-24">Duration</th>
              <th className="p-3 text-left text-sm font-medium w-24">Popularity</th>
              <th className="p-3 text-left text-sm font-medium w-32">Play</th>
            </tr>
          </thead>
          <tbody>
            {tracks.map((track, index) => <TrackListRow key={track.id} track={track} index={index} />)}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TrackListRow({ track, index, }: { track: TrackWithAudioFeatures; index: number; }) {
  return (
    <tr className="border-b hover:bg-muted/50 transition-colors">
      <td className="p-3 text-muted-foreground font-medium">{index + 1}</td>
      <td className="p-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 rounded">
            <AvatarImage src={track.album.images[0]?.url} alt={track.name} draggable={false} />
            <AvatarFallback><Music2 className="h-6 w-6" /></AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="font-medium truncate">{track.name}</p>
            <p className="text-sm text-muted-foreground truncate">{track.artists.map((a) => a.name).join(", ").slice(0, 30)}</p>
          </div>
        </div>
      </td>
      <td className="p-3 text-muted-foreground hidden md:table-cell">
        <p className="truncate max-w-xs">{track.album.name.slice(0, 30)}</p>
      </td>
      <td className="p-3 text-muted-foreground mr-6">
        {formatDuration(track.duration_ms)}
      </td>
      <td className="p-3 text-muted-foreground mr-6">
        {track.popularity}/100
      </td>
      <td className="p-3">
        <Button variant="outline" size="sm" asChild className="mr-6">
          <a href={track.external_urls.spotify || ""} target="_blank" rel="noopener noreferrer">Play on Spotify</a>
        </Button>
      </td>
    </tr>
  );
}
