import IconTitle from "@/components/icon-title";
import { Dna } from "lucide-react";

export default function PlaylistsDnaPage() {
  return (
    <div className="p-6 space-y-6">
      <IconTitle icon={Dna} title="Playlist DNA" subtitle="Analyze the DNA of your playlists and see how they compare to each other" />
    </div>
  );
}
