import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function IconSubtitle({ icon: Icon, title, subtitle, small, className }: { icon: LucideIcon; title: string; subtitle?: string; small?: boolean; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-1 mb-5", small ? "gap-0.5" : "", className)}>
      <div className="flex items-center gap-2 truncate">
        <Icon className={cn("h-6 w-6", small ? "h-5 w-5" : "")} />
        <span className={cn("text-2xl font-bold", small ? "text-xl" : "")}>{title}</span>
      </div>
      {subtitle && <span className="text-sm text-muted-foreground">{subtitle}</span>}
    </div>  
  )
}
