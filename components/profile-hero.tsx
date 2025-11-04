import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Calendar, Music2, Disc, Clock, TrendingUp, Users, Globe, Lock } from "lucide-react";
import { SpotifyAlbum, SpotifyTrack, SpotifyArtist, SpotifyPlaylist } from "@/lib/spotify";
import { formatDuration, yearFromDate } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import CustomAvatarComponent from "@/components/custom-avatar-component";

export enum ProfileType { Album = "album", Track = "track", Artist = "artist", Playlist = "playlist", }
type AlbumHeroProps = { type: ProfileType.Album; data: SpotifyAlbum; totalDuration?: number; };
type TrackHeroProps = { type: ProfileType.Track; data: SpotifyTrack; };
type ArtistHeroProps = { type: ProfileType.Artist; data: SpotifyArtist; };
type PlaylistHeroProps = { type: ProfileType.Playlist; data: SpotifyPlaylist; tracksCount: number; };
type ProfileHeroProps = AlbumHeroProps | TrackHeroProps | ArtistHeroProps | PlaylistHeroProps;

export default function ProfileHero(props: ProfileHeroProps) {
  const getProfileData = () => {
    switch (props.type) {
      case ProfileType.Album:
        return {
          backgroundImage: props.data.images[0]?.url,
          avatarImage: props.data.images[0]?.url,
          avatarName: props.data.name,
          profileType: props.data.album_type,
          title: props.data.name,
          spotifyUrl: props.data.external_urls.spotify,
          roundedAvatar: false,
        };
      case ProfileType.Track:
        return {
          backgroundImage: props.data.album.images[0]?.url,
          avatarImage: props.data.album.images[0]?.url,
          avatarName: props.data.album.name,
          profileType: "Track",
          title: props.data.name,
          spotifyUrl: props.data.external_urls.spotify,
          roundedAvatar: false,
        };
      case ProfileType.Artist:
        return {
          backgroundImage: props.data.images[0]?.url,
          avatarImage: props.data.images[0]?.url,
          avatarName: props.data.name,
          profileType: "Artist",
          title: props.data.name,
          spotifyUrl: props.data.external_urls.spotify,
          roundedAvatar: true,
        };
      case ProfileType.Playlist:
        return {
          backgroundImage: props.data.images[0]?.url,
          avatarImage: props.data.images[0]?.url,
          avatarName: props.data.name,
          profileType: "Playlist",
          title: props.data.name,
          spotifyUrl: props.data.external_urls.spotify,
          roundedAvatar: false,
        };
    }
  };

  const renderAdditionalContent = () => {
    switch (props.type) {
      case ProfileType.Album:
        return (
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-4">
            {props.data.artists?.map((artist, index) => (
              <div key={artist.id} className="flex items-center gap-2">
                <Link href={`/artists/${artist.id}`} className="text-lg md:text-xl text-muted-foreground hover:text-foreground transition-colors">
                  {artist.name}
                </Link>
                {index < (props.data.artists?.length || 0) - 1 && <span className="text-muted-foreground">x</span>}
              </div>
            ))}
          </div>
        );
      
      case ProfileType.Track:
        return (
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-4">
            {props.data.artists.map((artist, index) => (
              <div key={artist.id} className="flex items-center gap-2">
                <Link href={`/artists/${artist.id}`} className="text-lg md:text-xl text-muted-foreground hover:text-foreground transition-colors">
                  {artist.name}
                </Link>
                {index < props.data.artists.length - 1 && <span className="text-muted-foreground">x</span>}
              </div>
            ))}
          </div>
        );
      
      case ProfileType.Artist:
        return props.data.genres && props.data.genres.length > 0 ? (
          <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
            {props.data.genres.slice(0, 5).map((genre) => (
              <Badge key={genre} variant="secondary" className="text-xs">
                {genre}
              </Badge>
            ))}
          </div>
        ) : null;
      
      case ProfileType.Playlist:
        return (
          <>
            {props.data.description && (
              <p className="text-muted-foreground mb-4 max-w-2xl mx-auto md:mx-0">
                {props.data.description}
              </p>
            )}
            <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-muted-foreground">
              <span>By</span>
              <span className="font-semibold text-foreground">{props.data.owner.display_name}</span>
            </div>
          </>
        );
    }
  };

  const renderMetadata = () => {
    switch (props.type) {
      case ProfileType.Album:
        return (
          <>
            {props.data.release_date && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="font-semibold">{yearFromDate(props.data.release_date)}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Music2 className="h-4 w-4" />
              <span className="font-semibold">{props.data.total_tracks} tracks</span>
            </div>
            {props.totalDuration && props.totalDuration > 0 && (
              <div className="flex items-center gap-2">
                <Disc className="h-4 w-4" />
                <span className="font-semibold">{formatDuration(props.totalDuration)} total</span>
              </div>
            )}
          </>
        );
      
      case ProfileType.Track:
        return (
          <>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="font-semibold">{formatDuration(props.data.duration_ms)}</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="font-semibold">Popularity: {props.data.popularity}/100</span>
            </div>
            <div className="flex items-center gap-2">
              <Disc className="h-4 w-4" />
              <Link href={`/albums/${props.data.album.id}`} className="font-semibold hover:underline">
                {props.data.album.name}
              </Link>
            </div>
            {props.data.album.release_date && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="font-semibold">{yearFromDate(props.data.album.release_date)}</span>
              </div>
            )}
          </>
        );
      
      case ProfileType.Artist:
        return (
          <>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="font-semibold">
                {props.data.followers?.total.toLocaleString()} followers
              </span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="font-semibold">Popularity: {props.data.popularity}/100</span>
            </div>
          </>
        );
      
      case ProfileType.Playlist:
        return (
          <>
            <div className="flex items-center gap-2">
              <Music2 className="h-4 w-4" />
              <span className="font-semibold">
                {props.tracksCount} {props.tracksCount === 1 ? "track" : "tracks"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="font-semibold">
                {props.data.followers?.total.toLocaleString()} {props.data.followers?.total === 1 ? "follower" : "followers"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {props.data.public ? (
                <>
                  <Globe className="h-4 w-4" />
                  <span className="font-semibold">Public</span>
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  <span className="font-semibold">Private</span>
                </>
              )}
            </div>
          </>
        );
    }
  };

  const { backgroundImage, avatarImage, avatarName, profileType, title, spotifyUrl, roundedAvatar } = getProfileData();

  return (
    <div className="relative h-[550px] md:h-[500px] sm:rounded-t-2xl rounded-none bg-gradient-to-b from-white/15 to-background overflow-hidden">
      {backgroundImage && (
        <div className="absolute inset-0 opacity-30">
          <Image src={backgroundImage} alt={title} fill className="object-cover blur-xl" priority draggable={false} />
        </div>
      )}
      
      <div className="relative h-full max-w-7xl mx-auto px-6 flex items-end pb-8">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-3 w-full">
          <CustomAvatarComponent image={avatarImage} name={avatarName} className={`h-48 w-48 md:h-64 md:w-64 border-2 border-background shadow-2xl ${roundedAvatar ? '' : 'rounded-lg'}`} />
          
          <div className="flex-1 text-center md:text-left space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2 capitalize">{profileType}</p>
              <h1 className="text-3xl md:text-5xl font-bold mb-2">{title}</h1>
              {renderAdditionalContent()}
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm">
              {renderMetadata()}
            </div>

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