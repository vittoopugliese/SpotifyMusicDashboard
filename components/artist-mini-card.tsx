import Link from "next/link";
import { SpotifyArtist } from "@/lib/spotify";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { TooltipTrigger, TooltipContent, TooltipProvider, Tooltip } from "@/components/ui/tooltip";

export default function ArtistMiniCard({artist, simplified = false}: {artist: SpotifyArtist; simplified?: boolean}) {
  
  const content = (
    <Link href={`/artists/${artist.id}`} className="bg-muted/50 rounded-lg p-4 hover:bg-muted transition-colors flex flex-col items-center justify-center" style={{userSelect: "none"}} >
      <Avatar className="h-24 w-24 mx-auto mb-3">
        <AvatarImage src={artist.images[0]?.url} alt={artist.name} draggable={false} className="object-cover" />
        <AvatarFallback className="text-lg">{artist.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <p className="text-center font-medium truncate w-full">{artist.name}</p>
      <p className="text-center text-sm text-muted-foreground">{artist.genres[0] || "Unknown"}</p>
    </Link>
  );

  if (simplified) return content;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent>
          <p>Go to {artist.name}&apos;s profile</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}