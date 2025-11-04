import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { TrendingUp } from "lucide-react";
import IconSubtitle from "@/components/icon-subtitle";

type PopularityAnalysisProps = {
  popularityDistribution: Array<{ range: string; count: number }>;
  avgPopularity: number;
};

const COLORS = ["#1DB954", "#1ed760", "#19e68c", "#15d4a8", "#12c2c1"];

export default function PopularityAnalysis({ popularityDistribution, avgPopularity }: PopularityAnalysisProps) {
  const getPopularityLabel = (avg: number) => {
    if (avg >= 80) return "Extremely Popular 🔥";
    if (avg >= 60) return "Very Popular ⭐";
    if (avg >= 40) return "Moderately Popular 👍";
    if (avg >= 20) return "Underground 🎵";
    return "Hidden Gems 💎";
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <IconSubtitle icon={TrendingUp} title="Popularity Analysis" subtitle={`Average: ${avgPopularity}/100 • ${getPopularityLabel(avgPopularity)}`} small />
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={popularityDistribution}>
          <XAxis dataKey="range" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#1DB954" radius={[8, 8, 0, 0]}>
            {popularityDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-4 p-4 bg-muted/50 rounded-lg">
        <p className="text-sm text-muted-foreground">
          {avgPopularity >= 70 
            ? "This playlist features mainstream hits that are widely recognized!" 
            : avgPopularity >= 40 
            ? "A balanced mix of popular tracks and lesser-known gems." 
            : "This playlist dives deep into underground and niche tracks. You're a true music explorer!"}
        </p>
      </div>
    </div>
  );
}

