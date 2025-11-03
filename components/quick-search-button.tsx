"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { useRouter } from "next/navigation";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import SearchBar from "./search-bar";

export function QuickSearchButton() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const isMobile = useIsMobile();

  // Keyboard shortcut: Cmd+K or Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSearch = (type: 'tracks' | 'artists' | 'albums' | 'playlists') => {
    if (!searchQuery.trim()) return;
    setOpen(false);
    router.push(`/${type}/search?q=${encodeURIComponent(searchQuery.trim())}`);
    setSearchQuery("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim()) handleSearch('tracks');
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button className="relative h-9 w-9 p-0 sm:w-48 md:w-64 sm:justify-start sm:px-3" variant="outline" size="sm" onClick={() => setOpen(true)} >
            <Search className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline-flex">Search...</span>
            <kbd className="pointer-events-none absolute right-2 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="sm:hidden">
          <p className="text-xs">Quick search</p>
        </TooltipContent>
      </Tooltip>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[calc(100vw-2rem)] max-w-[550px] sm:w-full">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">Quick Search</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3 sm:gap-4">
            <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder={isMobile ? "Search..." : "Search tracks, artists, albums, playlists..."} autoFocus onKeyDown={handleKeyDown} />

            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={() => handleSearch('tracks')} disabled={!searchQuery.trim()} className="text-xs sm:text-sm" >
                <span className="hidden sm:inline">Search </span>Tracks
              </Button>
              <Button variant="outline" onClick={() => handleSearch('artists')} disabled={!searchQuery.trim()} className="text-xs sm:text-sm" >
                <span className="hidden sm:inline">Search </span>Artists
              </Button>
              <Button variant="outline" onClick={() => handleSearch('albums')} disabled={!searchQuery.trim()} className="text-xs sm:text-sm" >
                <span className="hidden sm:inline">Search </span>Albums
              </Button>
              <Button variant="outline" onClick={() => handleSearch('playlists')} disabled={!searchQuery.trim()} className="text-xs sm:text-sm" >
                <span className="hidden sm:inline">Search </span>Playlists
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center hidden sm:block">
              Press <kbd className="px-1.5 py-0.5 text-xs font-semibold text-foreground bg-muted rounded">Enter</kbd> to search tracks
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}