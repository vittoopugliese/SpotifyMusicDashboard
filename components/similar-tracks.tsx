"use client";

import { SpotifyTrack } from "@/lib/spotify";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ExternalLink, Music } from "lucide-react";
import CustomAlertComponent from "./custom-alert-component";

type SimilarTracksProps = {
  tracks: SpotifyTrack[];
  onSelectTrack: (track: SpotifyTrack) => void;
};

export function SimilarTracks({ tracks, onSelectTrack }: SimilarTracksProps) {
  if (tracks.length === 0) return <CustomAlertComponent title="No similar tracks found" description="Try with another track" />

  return (
    <div className="border rounded-lg p-6 bg-card">
      <h3 className="text-lg font-semibold mb-4">Similar Tracks</h3>
      <div className="space-y-3">
        {tracks.map((track) => (
          <div key={track.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group">
            <Avatar className="h-12 w-12 rounded">
              <AvatarImage src={track.album.images[0]?.url} alt={track.name} draggable={false} />
              <AvatarFallback draggable={false}>
                <Music className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <p className="font-medium line-clamp-1">{track.name}</p>
              <p className="text-sm text-muted-foreground line-clamp-1">{track.artists.map(a => a.name).join(", ")}</p>
            </div>

            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="outline" size="sm" onClick={() => onSelectTrack(track)}>Analyze</Button>
              <Button variant="ghost" size="icon" asChild className="h-8 w-8" >
                <a href={track.external_urls.spotify} target="_blank" rel="noopener noreferrer" >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

