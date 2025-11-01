"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Music } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SpotifyTrack } from "@/lib/spotify";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type TrackSearchBarProps = {
  onSelectTrack: (track: SpotifyTrack) => void;
  placeholder?: string;
};

export function TrackSearchBar({ onSelectTrack, placeholder = "Search for a track..." }: TrackSearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SpotifyTrack[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/spotify/search-tracks?q=${encodeURIComponent(query)}&limit=8`);
        const data = await res.json();
        
        if (data.tracks) {
          setResults(data.tracks);
          setShowResults(true);
        }
      } catch (error) {
        console.error("Error searching tracks:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSelectTrack = (track: SpotifyTrack) => {
    onSelectTrack(track);
    setQuery("");
    setResults([]);
    setShowResults(false);
  };

  return (
    <div ref={searchRef} className="relative w-full">
      <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input type="text" placeholder={placeholder} value={query} onChange={(e) => setQuery(e.target.value)} 
          onFocus={() => results.length > 0 && setShowResults(true)} className="pl-10 w-full h-11" draggable={false} />
      </div>

      {showResults && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-background border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {results.map((track) => (
            <button key={track.id} onClick={() => handleSelectTrack(track)} className={cn("w-full flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors", "border-b last:border-b-0")}>
              <Avatar className="h-12 w-12 rounded">
                <AvatarImage src={track.album.images[0]?.url} alt={track.name} />
                <AvatarFallback>
                  <Music className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <p className="font-medium line-clamp-1">{track.name}</p>
                <p className="text-sm text-muted-foreground line-clamp-1">{track.artists.map(a => a.name).join(", ")}</p>
              </div>
              <div className="text-xs text-muted-foreground">{track.album.name}</div>
            </button>
          ))}
        </div>
      )}

      {showResults && query && !isLoading && results.length === 0 && (
        <div className="absolute top-full mt-2 w-full bg-background border rounded-lg shadow-lg z-50 p-4 text-center text-muted-foreground">No tracks found</div>
      )}
    </div>
  );
}

