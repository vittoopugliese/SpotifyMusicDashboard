import IconTitle from "@/components/icon-title";
import { Music3 } from "lucide-react";

export default function TracksAnalysisPage() {
  return (
    <div className="p-6 space-y-6">
      <IconTitle icon={<Music3 className="h-8 w-8" />} title="Track Analysis" />
    </div>
  );
}
