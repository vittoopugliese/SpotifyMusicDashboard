import { Info } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "./ui/alert";
import { cn } from "@/lib/utils";

export default function CustomAlertComponent({ title, description, variant = "default" }: { title: string; description: string; variant?: "default" | "destructive" }) {
  return (
    <Alert variant={variant} className={variant === "destructive" ? "bg-destructive/10 border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive" : "border-gray-200 dark:border-gray-700"}>
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-col">
          <AlertTitle className={cn("text-lg mb-1", variant === "destructive" ? "text-destructive" : "")}>{title}</AlertTitle>
          <AlertDescription className={cn("text-sm text-muted-foreground", variant === "destructive" ? "text-destructive" : "")}>{description}</AlertDescription>
        </div>
        <Info className={cn("size-6 text-muted-foreground hover:text-primary transition-colors cursor-pointer", variant === "destructive" ? "text-destructive" : "")} />
      </div>
    </Alert>
  );
}