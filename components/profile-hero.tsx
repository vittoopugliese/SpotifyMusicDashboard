import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import CustomAvatarComponent from "@/components/custom-avatar-component";
import { ReactNode } from "react";

type ProfileHeroProps = {
  /** URL de la imagen de fondo */
  backgroundImage?: string;
  /** URL de la imagen del avatar/perfil */
  avatarImage?: string;
  /** Nombre para el avatar (usado para fallback) */
  avatarName: string;
  /** Tipo de perfil (Artist, Album, Track, Playlist) */
  profileType: string;
  /** Título principal */
  title: string;
  /** URL externa a Spotify */
  spotifyUrl: string;
  /** Si el avatar debe ser circular (true para artistas) */
  roundedAvatar?: boolean;
  /** Contenido adicional que va después del título (artistas, descripción, etc.) */
  children?: ReactNode;
  /** Metadatos que se muestran en la parte inferior (duración, popularidad, etc.) */
  metadata?: ReactNode;
};

export default function ProfileHero({ backgroundImage, avatarImage, avatarName, profileType, title, spotifyUrl, roundedAvatar = false, children, metadata, }: ProfileHeroProps) {
  return (
    <div className="relative h-[400px] md:h-[500px] bg-gradient-to-b from-primary/20 to-background overflow-hidden">
      {backgroundImage && (
        <div className="absolute inset-0 opacity-30">
          <Image src={backgroundImage} alt={title} fill className="object-cover blur-xl" priority draggable={false} />
        </div>
      )}
      
      <div className="relative h-full max-w-7xl mx-auto px-6 flex items-end pb-8">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-6 w-full">
          <CustomAvatarComponent image={avatarImage} name={avatarName} className={`h-48 w-48 md:h-64 md:w-64 border-2 border-background shadow-2xl ${roundedAvatar ? '' : 'rounded-lg'}`} />
          
          <div className="flex-1 text-center md:text-left space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2 capitalize">{profileType}</p>
              <h1 className="text-3xl md:text-5xl font-bold mb-2">{title}</h1>
              {children}
            </div>

            {metadata && (
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm">
                {metadata}
              </div>
            )}

            <div className="flex gap-3 justify-center md:justify-start pt-2">
              <Button asChild size="lg">
                <a href={spotifyUrl} target="_blank" rel="noopener noreferrer" className="gap-2">
                  <ExternalLink className="h-5 w-5" />
                  Open in Spotify
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

