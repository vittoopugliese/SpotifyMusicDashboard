"use client";

import { Button } from "@/components/button";
import { Download, Share2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/dropdown-menu";
import { SpotifyPlaylist } from "@/lib/spotify";

type ExportAnalysisProps = {
  playlist: SpotifyPlaylist;
  analytics: any;
};

export default function ExportAnalysis({ playlist, analytics }: ExportAnalysisProps) {
  const handleExportJSON = () => {
    const exportData = {
      playlist: {
        id: playlist.id,
        name: playlist.name,
        description: playlist.description,
        owner: playlist.owner?.display_name,
        tracks: playlist.tracks?.total,
      },
      analysis: {
        personality: analytics.personality,
        mood: analytics.mood,
        era: analytics.era,
        diversity: analytics.diversity,
        avgPopularity: analytics.avgPopularity,
        avgYear: analytics.avgYear,
        totalDuration: analytics.totalDuration,
        topArtists: analytics.topArtists.slice(0, 10),
        outliers: {
          longest: {
            name: analytics.longest.name,
            artists: analytics.longest.artists.map((a: any) => a.name).join(", "),
            duration: analytics.longest.duration_ms,
          },
          shortest: {
            name: analytics.shortest.name,
            artists: analytics.shortest.artists.map((a: any) => a.name).join(", "),
            duration: analytics.shortest.duration_ms,
          },
          mostPopular: {
            name: analytics.mostPopular.name,
            artists: analytics.mostPopular.artists.map((a: any) => a.name).join(", "),
            popularity: analytics.mostPopular.popularity,
          },
          leastPopular: {
            name: analytics.leastPopular.name,
            artists: analytics.leastPopular.artists.map((a: any) => a.name).join(", "),
            popularity: analytics.leastPopular.popularity,
          },
        },
      },
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${playlist.name.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_dna_analysis.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/playlists/dna?id=${playlist.id}`;
    navigator.clipboard.writeText(url);
    
    // Optional: Show a toast notification here
    alert("Link copied to clipboard!");
  };

  const handleShareSpotify = () => {
    if (playlist.external_urls?.spotify) {
      window.open(playlist.external_urls.spotify, "_blank");
    }
  };

  return (
    <div className="flex gap-2">
      <Button variant="outline" onClick={handleExportJSON} className="gap-2">
        <Download className="w-4 h-4" />
        Export Analysis
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Share2 className="w-4 h-4" />
            Share
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleCopyLink}>
            Copy Analysis Link
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleShareSpotify}>
            Open in Spotify
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

