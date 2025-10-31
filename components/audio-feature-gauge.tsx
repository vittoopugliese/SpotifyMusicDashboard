"use client";

import { Cell, PieChart, Pie } from "recharts";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

type AudioFeatureGaugeProps = {
  name: string;
  value: number;
  description: string;
  color?: string;
};

const FEATURE_COLORS: Record<string, string> = {
  energy: "#ef4444",
  danceability: "#22c55e",
  valence: "#eab308",
  acousticness: "#8b5cf6",
  instrumentalness: "#06b6d4",
  liveness: "#f97316",
  speechiness: "#ec4899",
};

const FEATURE_DESCRIPTIONS: Record<string, string> = {
  energy: "Energy represents a perceptual measure of intensity and activity. Energetic tracks feel fast, loud, and noisy.",
  danceability: "Describes how suitable a track is for dancing based on tempo, rhythm stability, beat strength, and regularity.",
  valence: "Musical positiveness conveyed by a track. High valence sounds more positive (happy, cheerful, euphoric).",
  acousticness: "A confidence measure of whether the track is acoustic. High values represent acoustic confidence.",
  instrumentalness: "Predicts whether a track contains no vocals. Values above 0.5 are intended to represent instrumental tracks.",
  liveness: "Detects the presence of an audience in the recording. Higher values represent an increased probability of live performance.",
  speechiness: "Detects the presence of spoken words. Values above 0.66 describe tracks that are probably made entirely of spoken words.",
};

export function AudioFeatureGauge({ name, value, description, color }: AudioFeatureGaugeProps) {
  const percentage = Math.round(value * 100);
  const featureColor = color || FEATURE_COLORS[name.toLowerCase()] || "#6b7280";
  const featureDescription = description || FEATURE_DESCRIPTIONS[name.toLowerCase()] || "";

  const data = [
    { name: "filled", value: percentage },
    { name: "empty", value: 100 - percentage },
  ];

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="relative w-32 h-32">
        <PieChart width={128} height={128}>
          <Pie data={data} cx={64} cy={64} startAngle={180} endAngle={0} innerRadius={45} outerRadius={60} paddingAngle={0} dataKey="value" >
            <Cell fill={featureColor} />
            <Cell fill="#e5e7eb" className="dark:fill-gray-800" />
          </Pie>
        </PieChart>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold">{percentage}</span>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <p className="text-sm font-medium capitalize">{name}</p>
        {featureDescription && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-3 w-3 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-sm">{featureDescription}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
}

