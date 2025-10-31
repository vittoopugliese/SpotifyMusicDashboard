"use client";

import { ArtistComparisonData } from "@/hooks/use-artist-comparison";
import { Trophy, TrendingUp, Music, Users, Hash } from "lucide-react";
import Image from "next/image";

interface WinnerCardsProps {
  comparisonData: ArtistComparisonData[];
}

type WinnerCategory = {
  title: string;
  icon: React.ReactNode;
  getValue: (data: ArtistComparisonData) => number;
  formatValue: (value: number) => string;
  color: string;
};

export default function WinnerCards({ comparisonData }: WinnerCardsProps) {
  const categories: WinnerCategory[] = [
    {
      title: "Most Popular",
      icon: <TrendingUp className="h-5 w-5" />,
      getValue: (data) => data.artist.popularity,
      formatValue: (val) => `${val}/100`,
      color: "from-purple-500/20 to-purple-600/20 border-purple-500/50",
    },
    {
      title: "Most Followers",
      icon: <Users className="h-5 w-5" />,
      getValue: (data) => data.artist.followers?.total || 0,
      formatValue: (val) => {
        if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
        if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
        return val.toString();
      },
      color: "from-blue-500/20 to-blue-600/20 border-blue-500/50",
    },
    {
      title: "Most Genres",
      icon: <Hash className="h-5 w-5" />,
      getValue: (data) => data.artist.genres.length,
      formatValue: (val) => `${val} genres`,
      color: "from-green-500/20 to-green-600/20 border-green-500/50",
    }
  ];

  const getWinner = (category: WinnerCategory) => {
    if (comparisonData.length === 0) return null;
    return comparisonData.reduce((winner, current) => {
      const winnerValue = category.getValue(winner);
      const currentValue = category.getValue(current);
      return currentValue > winnerValue ? current : winner;
    }, comparisonData[0]);
  };

  return (
    <div className="bg-card border rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold">Winner Categories</h2>
        <p className="text-sm text-muted-foreground mt-1">See who wins in each category</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => {
          const winner = getWinner(category);
          if (!winner) return null;

          const value = category.getValue(winner);

          return (
            <div key={category.title} className={`relative bg-gradient-to-br ${category.color} border rounded-lg p-4 hover:scale-[1.02] transition-transform`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {category.icon}
                  <h3 className="font-semibold text-sm">{category.title}</h3>
                </div>
                <Trophy className="h-5 w-5 text-yellow-500" />
              </div>

              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                  {winner.artist.images.length > 0 ? (
                    <Image src={winner.artist.images[0]?.url || ""} alt={winner.artist.name} fill className="object-cover" sizes="48px" draggable={false} />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <Music className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-bold truncate">{winner.artist.name}</p>
                  <p className="text-sm text-muted-foreground">{category.formatValue(value)}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

