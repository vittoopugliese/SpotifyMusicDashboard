import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import IconSubtitle from "@/components/icon-subtitle";

type ArtistData = {
  id: string;
  name: string;
  count: number;
  image?: string;
};

type ArtistCompositionProps = {
  topArtists: ArtistData[];
  totalArtists: number;
  artistDiversity: number;
};

const COLORS = ["#1DB954", "#1ed760", "#19e68c", "#15d4a8", "#12c2c1", "#0fa7b8", "#0c8ca0", "#097188"];

export default function ArtistComposition({ topArtists, totalArtists, artistDiversity }: ArtistCompositionProps) {
  const pieData = topArtists.slice(0, 8).map((artist) => ({
    name: artist.name,
    value: artist.count,
  }));

  const getDiversityLabel = (diversity: number) => {
    if (diversity >= 0.8) return "Extremely Diverse 🌈";
    if (diversity >= 0.6) return "Very Diverse ✨";
    if (diversity >= 0.4) return "Moderately Diverse 🎵";
    return "Focused Selection 🎯";
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <IconSubtitle 
        icon={Users} 
        title="Artist Composition" 
        subtitle={`${totalArtists} unique artists • ${getDiversityLabel(artistDiversity)}`} 
        small 
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                // label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Artists List */}
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          <h3 className="text-sm font-semibold mb-3">Top Artists</h3>
          {topArtists.slice(0, 10).map((artist, index) => (
            <div key={artist.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <span className="text-xs font-bold text-muted-foreground w-6">{index + 1}</span>
              <Avatar className="w-10 h-10">
                <AvatarImage src={artist.image} alt={artist.name} />
                <AvatarFallback>{artist.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{artist.name}</p>
              </div>
              <Badge variant="secondary">{artist.count} tracks</Badge>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-4 bg-muted/50 rounded-lg">
        <p className="text-sm text-muted-foreground">
          {artistDiversity >= 0.6 
            ? "This playlist showcases a wide variety of artists, perfect for discovering new sounds!" 
            : "This playlist focuses on a select group of artists, showing strong musical preferences."}
        </p>
      </div>
    </div>
  );
}

