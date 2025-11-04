import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Clock } from "lucide-react";
import IconSubtitle from "@/components/icon-subtitle";
import { formatDuration } from "@/lib/utils";

type DurationAnalysisProps = {
  durationDistribution: Array<{ range: string; count: number }>;
  avgDuration: number;
};

export default function DurationAnalysis({ durationDistribution, avgDuration }: DurationAnalysisProps) {
  const getLengthStyle = (avgMs: number) => {
    const avgMin = avgMs / 60000;
    if (avgMin >= 5) return "Epic Journeys 🎭";
    if (avgMin >= 4) return "Standard Length 🎵";
    if (avgMin >= 3) return "Radio-Friendly 📻";
    return "Quick Hits ⚡";
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <IconSubtitle icon={Clock} title="Duration Analysis" subtitle={`Average: ${formatDuration(avgDuration)} • ${getLengthStyle(avgDuration)}`} small />
      
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={durationDistribution}>
          <XAxis dataKey="range" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#1DB954" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-4 p-4 bg-muted/50 rounded-lg">
        <p className="text-sm text-muted-foreground">
          {avgDuration >= 300000 
            ? "This playlist features longer tracks, perfect for deep listening sessions." 
            : avgDuration >= 210000 
            ? "A classic mix of standard-length tracks." 
            : "Short and sweet! Perfect for quick listening sessions."}
        </p>
      </div>
    </div>
  );
}

