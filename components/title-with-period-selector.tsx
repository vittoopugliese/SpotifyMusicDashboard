import React from "react";
import { Button } from "@/components/ui/button";
import { cn, timeRangeLabels } from "@/lib/utils";

const DEFAULT_LABELS = {
  short_term: "Últimas 4 semanas",
  medium_term: "6 meses",
  long_term: "Años",
};

export type PeriodType = "short_term" | "medium_term" | "long_term";

interface TitleWithPeriodSelectorProps {
  title: React.ReactNode;
  icon?: React.ReactNode;
  value: PeriodType;
  onChange: (range: PeriodType) => void;
  className?: string;
  labels?: Partial<Record<PeriodType, string>>;
  actions?: React.ReactNode;
}

export function TitleWithPeriodSelector({ title, icon, value, onChange, className, labels, actions, }: TitleWithPeriodSelectorProps) {
  const mergedLabels = { ...DEFAULT_LABELS, ...labels };

  return (
    <div className={cn("flex flex-col gap-2 md:flex-row md:items-center justify-between w-full", className)}>
      <div className="flex items-center gap-2">
        {icon && icon}
        <span className="text-3xl font-bold">{title}</span>
      </div>
    <div className="flex items-center gap-2">
    <div className="ml-3 flex gap-1 bg-muted rounded-lg p-1">
          {Object.keys(timeRangeLabels).map((range) => (
            <Button key={range} variant={value === range as PeriodType ? "default" : "ghost"} size="sm" onClick={() => onChange(range as PeriodType)} type="button" >
              {mergedLabels[range as PeriodType]}
            </Button>
          ))}
        </div>
      {actions && <div className="mt-2 md:mt-0 flex-shrink-0">{actions}</div>}
    </div>
    </div>
  );
}

export default TitleWithPeriodSelector;