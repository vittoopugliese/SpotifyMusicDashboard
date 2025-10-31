import { ReactNode } from "react";

export default function IconTitle({ icon, title, subtitle }: { icon: ReactNode; title: ReactNode; subtitle?: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        {icon && icon}
        <span className="text-3xl font-bold">{title}</span>
      </div>
      {subtitle && <span className="text-sm text-muted-foreground">{subtitle}</span>}
  </div>
  )
}