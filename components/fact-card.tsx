import { LucideIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Share2 } from "lucide-react";

type FactCardProps = {
  icon: LucideIcon;
  category: string;
  fact: string;
  onShare?: () => void;
};

export default function FactCard({ icon: Icon, category, fact, onShare }: FactCardProps) {
  return (
    <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-lg p-6 hover:shadow-lg transition-all group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/20 rounded-lg">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <span className="text-xs font-semibold text-primary uppercase tracking-wide">{category}</span>
        </div>
        {onShare && (
          <Button variant="ghost" size="icon-sm" onClick={onShare} className="opacity-0 group-hover:opacity-100 transition-opacity" >
            <Share2 className="h-4 w-4" />
          </Button>
        )}
      </div>
      <p className="text-base text-foreground leading-relaxed">{fact}</p>
    </div>
  );
}