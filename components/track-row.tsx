import {SpotifyTrack} from "@/lib/spotify";
import {Avatar, AvatarImage, AvatarFallback} from "@radix-ui/react-avatar";
import {Pause, Play} from "lucide-react";
import {Button} from "./ui/button";

function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function TrackRow({ track, index, onPlay, isPlaying, }: { track: SpotifyTrack; index: number; onPlay: (trackId: string) => void; isPlaying: boolean; }) {
  return (
    <tr className="border-b hover:bg-muted/50 transition-colors">
      <td className="p-3 text-muted-foreground w-12">{index + 1}</td>
      <td className="p-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={track.album.images[0]?.url} alt={track.album.name} />
            <AvatarFallback>{track.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{track.name}</p>
            <p className="text-sm text-muted-foreground">{track.artists[0]?.name}</p>
          </div>
        </div>
      </td>
      <td className="p-3 text-muted-foreground">{track.album.name}</td>
      <td className="p-3 text-muted-foreground">{formatTime(track.duration_ms)}</td>
      <td className="p-3">
        { track.preview_url
            ? <Button variant="ghost" size="icon" onClick={() => onPlay(track.id)} className="h-8 w-8">
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            : <span className="text-muted-foreground text-sm">N/A</span>}
      </td>
    </tr>
  );
}
