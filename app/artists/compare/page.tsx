import IconTitle from "@/components/icon-title";
import { Users } from "lucide-react";

export default function ArtistsComparePage() {
  
  return (
    <div className="p-6 space-y-6">
      <IconTitle icon={<Users className="h-8 w-8" />} title="Artists Compare" />
    </div>
  );
}
