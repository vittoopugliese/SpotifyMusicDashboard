import IconTitle from "@/components/icon-title";
import { TrendingUp } from "lucide-react";

export default function InsightsTrendsPage() {
  return (
    <div className="p-6 space-y-6">
      <IconTitle icon={TrendingUp} title="Trends" subtitle="Discover the latest music trends and see what's popular right now" />
    </div>
  );
}
