import { LucideIcon } from "lucide-react";

export default function ViewHint({ title, description, icon: Icon }: { title: string; description: string; icon: LucideIcon}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
      <Icon className="h-16 w-16 mb-4" />
      <p className="text-lg mb-1 font-bold">{title}</p>
      <p className="text-sm">{description}</p>
    </div>
  );
}
