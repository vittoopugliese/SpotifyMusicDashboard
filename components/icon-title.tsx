import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

export default function IconTitle({ icon: Icon, title, subtitle, action }: { icon: LucideIcon; title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 truncate">
          <Icon className="h-8 w-8" />
          <span className="text-3xl font-bold">{title}</span>
        </div>
        {action && <div>{action}</div>}
      </div>
      {subtitle && <span className="text-sm text-muted-foreground">{subtitle}</span>}
  </div>
  )
}