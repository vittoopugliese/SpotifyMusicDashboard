import Link from "next/link";
import { SpotifyArtist } from "@/lib/spotify";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { TooltipTrigger, TooltipContent, TooltipProvider, Tooltip } from "@/components/ui/tooltip";

export default function ArtistMiniCard({artist, simplified = false}: {artist: SpotifyArtist; simplified?: boolean}) {
  const content = (
    <Link href={`/artists/${artist.id}`} className={`${simplified ? '' : 'bg-muted/50 '}rounded-lg p-2 sm:p-3 md:p-4 hover:bg-muted transition-colors flex flex-col items-center justify-between`} style={{userSelect: "none"}} >
      <Avatar className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 mx-auto mb-2 sm:mb-3">
        <AvatarImage src={artist.images[0]?.url} alt={artist.name} draggable={false} className="object-cover" />
        <AvatarFallback className="text-sm sm:text-base md:text-lg">{artist.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <p className="text-center font-medium truncate w-full text-xs sm:text-sm md:text-base">{artist.name}</p>
      <p className="text-center text-xs sm:text-sm text-muted-foreground truncate w-full">{artist.genres[0] || "music"}</p>
    </Link>
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent>
          <p>Visit {artist.name}&apos;s profile</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}