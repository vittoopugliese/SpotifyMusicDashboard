"use client";

import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";
import { useUserPlaylists } from "@/hooks/use-user-playlists";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Music2 } from "lucide-react";
import { SpotifyPlaylist } from "@/lib/spotify";
import SearchBar from "./search-bar";
import LoadingComponent from "./loading-component";

type PlaylistSelectorProps = {
  onSelectPlaylist: (playlistId: string) => void;
  selectedPlaylistName?: string;
};

export default function PlaylistSelector({ onSelectPlaylist, selectedPlaylistName }: PlaylistSelectorProps) {
  const { playlists, isLoading } = useUserPlaylists();
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [urlInput, setUrlInput] = useState("");

  const filteredPlaylists = playlists.filter((playlist) =>
    playlist.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectPlaylist = (playlist: SpotifyPlaylist) => {
    onSelectPlaylist(playlist.id);
    setOpen(false);
    setSearchTerm("");
  };

  const handleUrlSubmit = () => {
    // Extract playlist ID from Spotify URL
    // URLs can be: https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M
    // or: spotify:playlist:37i9dQZF1DXcBWIGoYBM5M
    const urlMatch = urlInput.match(/playlist[\/:]([a-zA-Z0-9]+)/);
    if (urlMatch && urlMatch[1]) {
      onSelectPlaylist(urlMatch[1]);
      setOpen(false);
      setUrlInput("");
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-semibold md:text-lg">Select a Playlist</h2>
          <p className="text-md text-muted-foreground mt-1">
            {selectedPlaylistName 
              ? `Currently analyzing: ${selectedPlaylistName}` 
              : "Choose from your playlists or enter a Spotify playlist URL"}
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 w-full md:w-auto">
              <Search className="w-4 h-4" />
              {selectedPlaylistName ? "Change Playlist" : "Select Playlist"}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[600px]">
            <DialogHeader>
              <DialogTitle>Select a Playlist</DialogTitle>
              <DialogDescription>Choose from your playlists or paste a Spotify playlist URL</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* URL Input Search Bar */}
              <SearchBar value={urlInput} onChange={setUrlInput} placeholder="https://open.spotify.com/playlist/..." 
                labelTitle="Paste Spotify playlist URL" buttonText="Analyze" buttonAction={handleUrlSubmit} />
              {/* Playlist Search Bar, local search */} 
              <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search playlists..." 
                labelTitle="Or search in your playlists" />

              {/* Playlist List */}
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {isLoading 
                  ? <LoadingComponent message="Loading playlists..." /> 
                  : filteredPlaylists.length > 0 ? (
                    filteredPlaylists.map((playlist) => (
                      <button key={playlist.id} onClick={() => handleSelectPlaylist(playlist)}
                        className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors text-left cursor-pointer">
                        <Avatar className="w-14 h-14 rounded-md">
                          <AvatarImage src={playlist.images?.[0]?.url} alt={playlist.name} />
                          <AvatarFallback className="rounded-md">
                            <Music2 className="w-6 h-6" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{playlist.name}</p>
                          <p className="text-sm text-muted-foreground">{playlist.tracks?.total || 0} tracks</p>
                        </div>
                      </button>
                    ))
                ) : <p className="text-center text-muted-foreground py-8">{searchTerm ? "No playlists found" : "No playlists available"}</p> }
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}