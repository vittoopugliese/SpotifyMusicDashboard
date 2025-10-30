import { ReactNode } from "react";

export default function IconTitle({ icon, title }: { icon: ReactNode; title: ReactNode }) {
  return (
    <div className="flex items-center gap-2">
    {icon && icon}
    <span className="text-3xl font-bold">{title}</span>
  </div>
  )
}