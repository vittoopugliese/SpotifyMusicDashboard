import { cn } from "@/lib/utils";
import { Spinner } from "./ui/spinner";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function CustomAvatarComponent({ image, name, size = 14, className = "", loading = false }: { image: string | undefined; name: string; size?: number; className?: string; loading?: boolean }) {
  return (
    <Avatar className={cn(`h-${size} w-${size}`, className)} draggable={false}>
        { loading 
          ? <Spinner className="size-8" />
          : <>
              <AvatarImage src={image} alt={name || "User"} draggable={false} />
              <AvatarFallback className="font-bold" draggable={false}>{(name || "U").charAt(0).toUpperCase()}</AvatarFallback>
            </>
        }
    </Avatar>
  );
};