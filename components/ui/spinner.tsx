import { cn } from "@/lib/utils";

function Spinner({className}: React.ComponentProps<"svg">) {
  return <div role="status" aria-label="Loading" className={cn("animate-spin rounded-full h-6 w-6 border-b-3 border-primary", className)}></div>
}

export { Spinner };