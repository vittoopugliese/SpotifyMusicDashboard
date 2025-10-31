import IconTitle from "@/components/icon-title";
import { Play } from "lucide-react";

export default function PlaylistsYoursPage() {
  return (
    <div className="p-6 space-y-6">
      <IconTitle icon={Play} title="Your Playlists" subtitle="View your playlists and their contents" />
    </div>
  );
}
