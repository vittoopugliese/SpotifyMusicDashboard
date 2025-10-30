import IconTitle from "@/components/icon-title";
import { Search } from "lucide-react";

export default function ArtistsSearchPage() {
  return (
    <div className="p-6 space-y-6">
      <IconTitle icon={<Search className="h-8 w-8" />} title="Artists Search" />
    </div>
  );
}
