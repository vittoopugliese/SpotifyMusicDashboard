"use client";

import { ArtistComparisonData } from "@/hooks/use-artist-comparison";
import { Music2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import IconSubtitle from "./icon-subtitle";

interface TopTracksComparisonProps {
  comparisonData: ArtistComparisonData[];
}

const COLORS = ["#8b5cf6", "#10b981", "#f59e0b"];

export default function TopTracksComparison({ comparisonData }: TopTracksComparisonProps) {
  // Prepare data: top 5 tracks from each artist
  const chartData = Array.from({ length: 5 }, (_, index) => {
    const dataPoint: Record<string, string | number> = { position: `#${index + 1}` };
    
    comparisonData.forEach((data) => {
      const track = data.topTracks[index];
      if (track) dataPoint[data.artist.name] = track.popularity;
    });

    return dataPoint;
  });

  return (
    <div className="bg-card border rounded-lg p-6">
      <IconSubtitle icon={Music2} title="Top Tracks Popularity" subtitle="Compare the popularity of each artist&apos;s top tracks" small className="mb-4" />

      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="position" tick={{ fill: "currentColor" }} />
          <YAxis tick={{ fill: "currentColor" }} domain={[0, 100]} label={{ value: "Popularity", angle: -90, position: "insideLeft", style: { fill: "currentColor" } }} />
          <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} labelStyle={{ color: "hsl(var(--foreground))" }} />
          <Legend wrapperStyle={{ paddingTop: "20px" }} />
          {comparisonData.map((data, index) => <Bar key={data.artist.id} dataKey={data.artist.name} fill={COLORS[index % COLORS.length]} radius={[8, 8, 0, 0]} />)}
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {comparisonData.map((data) => (
          <div key={data.artist.id} className="space-y-2">
            <h3 className="font-semibold text-sm">{data.artist.name}&apos;s Top Tracks</h3>
            <div className="space-y-1">
              {data.topTracks.slice(0, 5).map((track, idx) => (
                <div key={track.id} className="text-xs flex justify-between items-center py-1">
                  <span className="truncate flex-1">{idx + 1}. {track.name}</span>
                  <span className="text-muted-foreground ml-2">{track.popularity}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

