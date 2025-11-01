import { Sparkles } from "lucide-react";

type PlaylistPersonalityCardProps = {
  personality: string;
  mood: string;
  era: string;
  diversity: string;
};

export default function PlaylistPersonalityCard({ personality, mood, era, diversity }: PlaylistPersonalityCardProps) {
  return (
    <div className="bg-gradient-to-r from-primary/10 via-chart-2/10 to-primary/10 border border-primary/20 rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <Sparkles className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold">Playlist Personality</h2>
      </div>
      
      <div className="space-y-4">
        <div className="bg-background/50 rounded-lg p-4 border border-border">
          <p className="text-lg leading-relaxed">{personality}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-background/50 rounded-lg p-4 border border-border">
            <p className="text-xs text-muted-foreground mb-1">Overall Mood</p>
            <p className="text-lg font-semibold">{mood}</p>
          </div>

          <div className="bg-background/50 rounded-lg p-4 border border-border">
            <p className="text-xs text-muted-foreground mb-1">Musical Era</p>
            <p className="text-lg font-semibold">{era}</p>
          </div>

          <div className="bg-background/50 rounded-lg p-4 border border-border">
            <p className="text-xs text-muted-foreground mb-1">Artist Diversity</p>
            <p className="text-lg font-semibold">{diversity}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

