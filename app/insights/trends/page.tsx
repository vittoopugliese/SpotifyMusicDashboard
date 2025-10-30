import IconTitle from "@/components/icon-title";
import { TrendingUp } from "lucide-react";

export default function InsightsTrendsPage() {
  return (
    <div className="p-6 space-y-6">
      <IconTitle icon={<TrendingUp className="h-8 w-8" />} title="Trends" />
    </div>
  );
}
