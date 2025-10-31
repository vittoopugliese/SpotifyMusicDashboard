import { useState, useEffect, useCallback } from "react";
import { SpotifyArtist, SpotifyTrack } from "@/lib/spotify";
import { findCommonGenres, findUniqueGenres } from "@/lib/utils";

export type ArtistComparisonData = {
  artist: SpotifyArtist;
  topTracks: SpotifyTrack[];
};

interface UseArtistComparisonReturn {
  selectedArtists: SpotifyArtist[];
  comparisonData: ArtistComparisonData[];
  loading: boolean;
  error: string | null;
  addArtist: (artist: SpotifyArtist) => void;
  removeArtist: (artistId: string) => void;
  canAddMore: boolean;
  commonGenres: string[];
  uniqueGenres: Record<string, string[]>;
}

const MAX_ARTISTS = 3;

export function useArtistComparison(): UseArtistComparisonReturn {
  const [selectedArtists, setSelectedArtists] = useState<SpotifyArtist[]>([]);
  const [comparisonData, setComparisonData] = useState<ArtistComparisonData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addArtist = useCallback((artist: SpotifyArtist) => {
    setSelectedArtists(prev => {
      if (prev.length >= MAX_ARTISTS) return prev;
      if (prev.some(a => a.id === artist.id)) return prev;
      return [...prev, artist];
    });
  }, []);

  const removeArtist = useCallback((artistId: string) => {
    setSelectedArtists(prev => prev.filter(a => a.id !== artistId));
    setComparisonData(prev => prev.filter(d => d.artist.id !== artistId));
  }, []);

  // Fetch data for selected artists
  useEffect(() => {
    if (selectedArtists.length === 0) {
      setComparisonData([]);
      setError(null);
      return;
    }

    const fetchArtistData = async () => {
      setLoading(true);
      setError(null);

      try {
        const dataPromises = selectedArtists.map(async (artist) => {
          // Check if we already have data for this artist
          const existingData = comparisonData.find(d => d.artist.id === artist.id);
          if (existingData) return existingData;

          // Fetch artist details (includes all artist data: popularity, followers, genres, etc.)
          const artistResponse = await fetch(`/api/spotify/artist/${artist.id}`);
          if (!artistResponse.ok) throw new Error("Failed to fetch artist details");
          const artistDetails = await artistResponse.json();

          // Fetch top tracks (for display purposes only)
          const topTracksResponse = await fetch(`/api/spotify/artist/${artist.id}/top-tracks`);
          if (!topTracksResponse.ok) throw new Error("Failed to fetch top tracks");
          const topTracksData = await topTracksResponse.json();
          const topTracks: SpotifyTrack[] = topTracksData.tracks || [];

          return { artist: artistDetails, topTracks };
        });

        const results = await Promise.all(dataPromises);
        setComparisonData(results);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchArtistData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedArtists]); // If I add comparisonData to the dependency array, it will cause a infinite loop!

  // Calculate common and unique genres
  const commonGenres = comparisonData.length >= 2
    ? comparisonData.reduce((common, data, index) => {
        if (index === 0) return data.artist.genres;
        return findCommonGenres(common, data.artist.genres);
      }, [] as string[])
    : [];

  const uniqueGenres = comparisonData.reduce((acc, data) => {
    const otherGenres = comparisonData.filter(d => d.artist.id !== data.artist.id).map(d => d.artist.genres);
    acc[data.artist.id] = findUniqueGenres(data.artist.genres, otherGenres);
    return acc;
  }, {} as Record<string, string[]>);

  return { selectedArtists, comparisonData, loading, error, addArtist, removeArtist, canAddMore: selectedArtists.length < MAX_ARTISTS, commonGenres, uniqueGenres, };
}

