"use client";

import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/dialog";
import { useUserPlaylists } from "@/hooks/use-user-playlists";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar";
import { Music2 } from "lucide-react";
import { SpotifyPlaylist } from "@/lib/spotify";

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
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold">Select a Playlist to Analyze</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {selectedPlaylistName 
              ? `Currently analyzing: ${selectedPlaylistName}` 
              : "Choose from your playlists or enter a Spotify playlist URL"}
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
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
              {/* URL Input */}
              <div className="space-y-2">
                <Label htmlFor="playlist-url">Or paste Spotify playlist URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="playlist-url"
                    placeholder="https://open.spotify.com/playlist/..."
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                  />
                  <Button onClick={handleUrlSubmit} disabled={!urlInput}>Analyze</Button>
                </div>
              </div>

              {/* Search */}
              <div className="space-y-2">
                <Label htmlFor="search">Search your playlists</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search playlists..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              {/* Playlist List */}
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : filteredPlaylists.length > 0 ? (
                  filteredPlaylists.map((playlist) => (
                    <button
                      key={playlist.id}
                      onClick={() => handleSelectPlaylist(playlist)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors text-left"
                    >
                      <Avatar className="w-14 h-14 rounded-md">
                        <AvatarImage src={playlist.images?.[0]?.url} alt={playlist.name} />
                        <AvatarFallback className="rounded-md">
                          <Music2 className="w-6 h-6" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{playlist.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {playlist.tracks?.total || 0} tracks
                        </p>
                      </div>
                    </button>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    {searchTerm ? "No playlists found" : "No playlists available"}
                  </p>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

