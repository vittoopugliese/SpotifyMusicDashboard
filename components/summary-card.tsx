import { LucideIcon } from "lucide-react";

export default function SummaryCard({ icon: Icon, title, value, description }: { icon: LucideIcon; title: string; value: string | number; description?: string; loading?: boolean; }) {
  return (
    <div className="bg-card/50 rounded-lg p-4 border border-border/50 hover:bg-card/70 transition-all duration-300 hover:scale-102">
    <p className="text-xs text-muted-foreground mb-2 flex items-center gap-2"><Icon className="h-4 w-4" />{title}</p>
    <p className="text-2xl font-bold text-primary">{value}</p>
    <p className="text-xs text-muted-foreground mt-1">{description}</p>
  </div>
  );
}