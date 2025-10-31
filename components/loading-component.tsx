import { Spinner } from "./ui/spinner";
import { cn } from "@/lib/utils";

export default function LoadingComponent({message, size = 9}: {message: string, size?: number}) {
  return (
    <div className="flex items-center flex-col justify-center py-12">
      <Spinner className={cn("size-9", size)} />
      <p className="text-sm text-muted-foreground mt-3">{message}</p>
    </div>
  );
}
