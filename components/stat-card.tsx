import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Skeleton } from "./ui/skeleton";
import { LucideIcon } from "lucide-react";

function StatCard({ icon: Icon, title, value, loading, tooltipDescription }: { icon: LucideIcon; title: string; value: string | number; loading?: boolean; tooltipDescription?: string; }) {
  if (loading) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <Skeleton className="h-12 w-12 rounded-full mb-4" />
        <Skeleton className="h-6 w-24 mb-2" />
        <Skeleton className="h-8 w-32" />
      </div>
    );
  }

  const cardContent = (
    <div className="bg-card border border-border rounded-lg p-4 shadow-sm transition-all duration-300 hover:scale-102 hover:bg-card/90">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary/10 rounded-full">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-lg font-bold">{value}</p>
        </div>
      </div>
    </div>
  );

  if (tooltipDescription) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {cardContent}
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipDescription}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return cardContent;
}

export default StatCard;
