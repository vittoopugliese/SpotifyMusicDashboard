import { LucideIcon } from "lucide-react";

export default function IconTitle({ icon: Icon, title, subtitle }: { icon: LucideIcon; title: string; subtitle?: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Icon className="h-8 w-8" />
        <span className="text-3xl font-bold">{title}</span>
      </div>
      {subtitle && <span className="text-sm text-muted-foreground">{subtitle}</span>}
  </div>
  )
}