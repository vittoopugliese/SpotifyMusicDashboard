"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { SpotifyTrack } from "@/lib/spotify";
import { Slider } from "@radix-ui/react-slider";
import CustomAlertComponent from "./custom-alert-component";

type TrackPlayerProps = {
  track: SpotifyTrack;
};

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function TrackPlayer({ track }: TrackPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(30);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    setTimeout(() => {
      setIsPlaying(false);
      setCurrentTime(0);
    }, 0);
  }, [track.id]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (!audioRef.current || !track.preview_url) return;

    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  if (!track.preview_url) return <CustomAlertComponent title="Preview not available for this track" description="Try with another track" />

  return (
    <div className="border rounded-lg p-6 bg-card space-y-4">
      <audio ref={audioRef} src={track.preview_url} onTimeUpdate={handleTimeUpdate} onLoadedMetadata={handleLoadedMetadata} onEnded={handleEnded} />

      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16 rounded">
          <AvatarImage src={track.album.images[0]?.url} alt={track.name} />
          <AvatarFallback>{track.name.charAt(0)}</AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <p className="font-semibold line-clamp-1">{track.name}</p>
          <p className="text-sm text-muted-foreground line-clamp-1">{track.artists.map(a => a.name).join(", ")}</p>
        </div>

        <Button size="icon" onClick={togglePlay} className="h-12 w-12 rounded-full">
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
        </Button>
      </div>

      <div className="space-y-2">
        <Slider value={[currentTime]} max={duration} step={0.1} onValueChange={handleSeek} className="cursor-pointer" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={toggleMute} className="h-8 w-8" >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </Button>
        <Slider value={[isMuted ? 0 : volume]} max={1} step={0.01} className="w-24 cursor-pointer"
          onValueChange={(value: number[]) => {
            setVolume(value[0]);
            if (isMuted) setIsMuted(false);
          }}
        />
      </div>
    </div>
  );
}

