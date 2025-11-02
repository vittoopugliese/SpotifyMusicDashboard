import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn, timeRangeLabels } from "@/lib/utils";
import IconTitle from "./icon-title";
import { LucideIcon } from "lucide-react";
// import {
//      DropdownMenu,
//      DropdownMenuContent,
//      DropdownMenuItem,
//      DropdownMenuTrigger,
//    } from "@/components/ui/dropdown-menu";
//    import { MoreVertical } from "lucide-react";

const DEFAULT_LABELS = {
  short_term: "Last 4 weeks",
  medium_term: "6 months",
  long_term: "All time",
};

export type PeriodType = "short_term" | "medium_term" | "long_term";

interface TitleWithPeriodSelectorProps {
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  value: PeriodType;
  onChange: (range: PeriodType) => void;
  className?: string;
  actions?: ReactNode;
}

export function TitleWithPeriodSelector({ title, subtitle, icon, value, onChange, className, actions, }: TitleWithPeriodSelectorProps) {
  return (
    <div className={cn("flex flex-col gap-2 md:flex-row md:items-center justify-between w-full", className)}>
      <IconTitle icon={icon} title={title} subtitle={subtitle} />
        <div className="flex items-center gap-2 md:flex-row flex-col">
          <div className="flex gap-1 bg-muted rounded-lg p-1">
            {Object.keys(timeRangeLabels).map((range) => (
              <Button key={range} variant={value === range as PeriodType ? "default" : "ghost"} size="sm" onClick={() => onChange(range as PeriodType)} type="button" >
              {DEFAULT_LABELS[range as PeriodType]}
              </Button>
            ))}
          </div>
          {actions && <div className="mt-2 md:mt-0 flex-shrink-0">{actions}</div>}
        </div>
    </div>
  );
}

export default TitleWithPeriodSelector;