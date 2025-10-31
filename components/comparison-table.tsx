"use client";

import { ArtistComparisonData } from "@/hooks/use-artist-comparison";
import { Users, TrendingUp, Music } from "lucide-react";
import Image from "next/image";

interface ComparisonTableProps {
  comparisonData: ArtistComparisonData[];
  commonGenres: string[];
  uniqueGenres: Record<string, string[]>;
}

export default function ComparisonTable({ comparisonData, commonGenres, uniqueGenres }: ComparisonTableProps) {
  const formatFollowers = (count: number): string => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  return (
    <div className="bg-card border rounded-lg overflow-hidden">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold">Comparison Overview</h2>
        <p className="text-sm text-muted-foreground mt-1">Side-by-side comparison of selected artists</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 font-semibold">Metric</th>
              {comparisonData.map((data) => (
                <th key={data.artist.id} className="p-4 text-center min-w-[200px]">
                  <div className="flex flex-col items-center gap-2">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden">
                      {data.artist.images.length > 0 ? (
                        <Image src={data.artist.images[0]?.url || ""} alt={data.artist.name} fill className="object-cover" sizes="64px" draggable={false} />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <Music className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="font-semibold text-sm">{data.artist.name}</div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>

            <tr className="border-b hover:bg-muted/30 transition-colors">
              <td className="p-4 font-medium flex items-center gap-2"><TrendingUp className="h-4 w-4 text-muted-foreground" />Popularity</td>
              {comparisonData.map((data) => (
                <td key={data.artist.id} className="p-4 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <span className="font-semibold text-lg">{data.artist.popularity}/100</span>
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div className="bg-primary h-full rounded-full transition-all" style={{ width: `${data.artist.popularity}%` }} />
                    </div>
                  </div>
                </td>
              ))}
            </tr>

            <tr className="border-b hover:bg-muted/30 transition-colors">
              <td className="p-4 font-medium flex items-center gap-2"><Users className="h-4 w-4 text-muted-foreground" />Followers</td>
              {comparisonData.map((data) => (
                <td key={data.artist.id} className="p-4 text-center">
                  <span className="font-semibold text-lg">{formatFollowers(data.artist.followers?.total || 0)}</span>
                </td>
              ))}
            </tr>

            <tr className="border-b hover:bg-muted/30 transition-colors">
              <td className="p-4 font-medium flex items-center gap-2"><Music className="h-4 w-4 text-muted-foreground" />Total Genres</td>
              {comparisonData.map((data) => (
                <td key={data.artist.id} className="p-4 text-center">
                  <span className="font-semibold text-lg">{data.artist.genres.length}</span>
                </td>
              ))}
            </tr>

          </tbody>
        </table>
      </div>

      {/* Genres Section */}
      <div className="p-6 border-t space-y-4">
        <h3 className="font-semibold text-lg">Genre Analysis</h3>
        
        {/* Common Genres */}
        {commonGenres.length > 0 && (
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Common Genres</p>
            <div className="flex flex-wrap gap-2">
              {commonGenres.map((genre, idx) => (
                <span key={idx} className="text-xs bg-primary text-primary-foreground px-3 py-1 rounded-full">
                  {genre}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Unique Genres per Artist */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {comparisonData.map((data) => (
            <div key={data.artist.id} className="space-y-2">
              <p className="text-sm font-medium">{data.artist.name}&apos;s Unique Genres</p>
              <div className="flex flex-wrap gap-1">
                {uniqueGenres[data.artist.id]?.length > 0 ? (
                  uniqueGenres[data.artist.id].slice(0, 5).map((genre, idx) => (
                    <span key={idx} className="text-xs bg-muted text-foreground px-2 py-1 rounded-full">
                      {genre}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">No unique genres</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

