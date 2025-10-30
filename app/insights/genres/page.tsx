import IconTitle from "@/components/icon-title";
import { Music2 } from "lucide-react";

export default function InsightsGenresPage() {
  return (
    <div className="p-6 space-y-6">
      <IconTitle icon={<Music2 className="h-8 w-8" />} title="Genres" />
    </div>
  );
}
