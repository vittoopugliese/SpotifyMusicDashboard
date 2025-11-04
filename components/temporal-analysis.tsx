import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Calendar } from "lucide-react";
import IconSubtitle from "@/components/icon-subtitle";

type TemporalAnalysisProps = {
  decadeDistribution: Array<{ decade: string; count: number }>;
  avgYear: number;
  oldestYear: number;
  newestYear: number;
};

export default function TemporalAnalysis({ decadeDistribution, avgYear, oldestYear, newestYear }: TemporalAnalysisProps) {
  const getEraDescription = (year: number) => {
    if (year >= 2020) return "Modern Era - Contemporary Sounds";
    if (year >= 2010) return "2010s - Pop & EDM Dominance";
    if (year >= 2000) return "2000s - Digital Age";
    if (year >= 1990) return "1990s - Hip-Hop & Grunge";
    if (year >= 1980) return "1980s - Synth-Pop Era";
    if (year >= 1970) return "1970s - Classic Rock";
    return "Classic Era - Timeless Music";
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <IconSubtitle icon={Calendar} title="Temporal Analysis" subtitle={`${oldestYear} - ${newestYear} • ${getEraDescription(avgYear)}`} small />
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={decadeDistribution}>
          <XAxis dataKey="decade" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#1DB954" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="bg-muted/50 rounded-lg p-3 text-center">
          <p className="text-xs text-muted-foreground mb-1">Oldest Track</p>
          <p className="text-xl font-bold text-primary">{oldestYear}</p>
        </div>

        <div className="bg-muted/50 rounded-lg p-3 text-center">
          <p className="text-xs text-muted-foreground mb-1">Average Year</p>
          <p className="text-xl font-bold text-primary">~{avgYear}</p>
        </div>

        <div className="bg-muted/50 rounded-lg p-3 text-center">
          <p className="text-xs text-muted-foreground mb-1">Newest Track</p>
          <p className="text-xl font-bold text-primary">{newestYear}</p>
        </div>
      </div>
    </div>
  );
}