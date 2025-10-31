"use client";

import { useState, useEffect } from "react";
import IconTitle from "@/components/icon-title";
import { Input } from "@/components/ui/input";
import { Search, Music2 } from "lucide-react";
import { SpotifyArtist } from "@/lib/spotify";
import { useSpotifySession } from "@/contexts/spotify-session-context";
import { Spinner } from "@/components/ui/spinner";
import ArtistCard from "@/components/artist-card";

export default function ArtistsSearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [artists, setArtists] = useState<SpotifyArtist[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { session } = useSpotifySession();

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(searchQuery), 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setArtists([]);
      setError(null);
      return;
    }

    if (!session.authenticated) {
      setError("Por favor inicia sesión para buscar artistas");
      return;
    }

    const searchArtists = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/spotify/search-artists?q=${encodeURIComponent(debouncedQuery)}&limit=20`);

        if (!response.ok) throw new Error("Error al buscar artistas");

        const data = await response.json();
        setArtists(data.artists || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
        setArtists([]);
      } finally {
        setLoading(false);
      }
    };

    searchArtists();
  }, [debouncedQuery, session.authenticated]);
  
  return (
    <div className="p-6 space-y-6">
      <IconTitle icon={<Search className="h-8 w-8" />} title="Artists Search" />
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input type="text" placeholder="Busca un artista..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 w-full" />
      </div>

      {loading && (
        <div className="flex items-center flex-col justify-center py-12">
          <Spinner className="size-9" />
          <p className="text-sm text-muted-foreground">Searching artists...</p>
        </div>
      )}

      {error && <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-destructive">{error}</div>}

      {!loading && !error && artists.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {artists.map((artist) => <ArtistCard key={artist.id} artist={artist} />)}
        </div>
      )}

      {!loading && !error && debouncedQuery && artists.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <Music2 className="h-16 w-16 mb-4" />
          <p className="text-lg">No artists found</p>
          <p className="text-sm">Try with another search term</p>
        </div>
      )}

      {!loading && !error && !debouncedQuery && (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <Search className="h-16 w-16 mb-4" />
          <p className="text-lg mb-1 font-bold">Search your favorite artists</p>
          <p className="text-sm">Write the name of an artist to start searching</p>
        </div>
      )}
    </div>
  );
}
