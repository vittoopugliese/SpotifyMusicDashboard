import {LucideIcon} from "lucide-react";
import {Skeleton} from "./ui/skeleton";

function StatCard({ icon: Icon, title, value, loading, }: { icon: LucideIcon; title: string; value: string | number; loading?: boolean; }) {
  if (loading) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <Skeleton className="h-12 w-12 rounded-full mb-4" />
        <Skeleton className="h-6 w-24 mb-2" />
        <Skeleton className="h-8 w-32" />
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary/10 rounded-full">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
}

export default StatCard;
