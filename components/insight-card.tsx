import {Radio} from "lucide-react";
import {Skeleton} from "./ui/skeleton";

function InsightCard({ insight, loading, }: { insight: string | null; loading?: boolean; }) {
  if (loading) {
    return (
      <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-lg p-6">
        <Skeleton className="h-6 w-32 mb-4" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-1">
        <Radio className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Daily Insight</h3>
      </div>
      <p className="text-muted-foreground leading-relaxed">{insight}</p>
    </div>
  );
}

export default InsightCard;
