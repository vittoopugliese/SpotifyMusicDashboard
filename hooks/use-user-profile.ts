import { useState, useEffect } from "react";
import { SpotifyUserProfile, SpotifyArtist, SpotifyTrack } from "@/lib/spotify";

type UserProfileData = {
  profile: SpotifyUserProfile | null;
  topArtists: SpotifyArtist[];
  topTracks: SpotifyTrack[];
  isLoading: boolean;
  error: string | null;
};

export function useUserProfile(): UserProfileData {
  const [profile, setProfile] = useState<SpotifyUserProfile | null>(null);
  const [topArtists, setTopArtists] = useState<SpotifyArtist[]>([]);
  const [topTracks, setTopTracks] = useState<SpotifyTrack[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch user profile
        const sessionRes = await fetch("/api/spotify/session");
        if (!sessionRes.ok) throw new Error("Failed to fetch user profile");
        const sessionData = await sessionRes.json();
        
        if (!sessionData.authenticated) {
          throw new Error("User not authenticated");
        }
        
        setProfile(sessionData.profile);

        // Fetch top artists
        const topArtistsRes = await fetch("/api/spotify/top-artists?limit=10&time_range=medium_term");
        if (topArtistsRes.ok) {
          const topArtistsData = await topArtistsRes.json();
          setTopArtists(topArtistsData.items || []);
        }

        // Fetch top tracks
        const topTracksRes = await fetch("/api/spotify/top-tracks?limit=10&time_range=medium_term");
        if (topTracksRes.ok) {
          const topTracksData = await topTracksRes.json();
          setTopTracks(topTracksData.items || []);
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  return { profile, topArtists, topTracks, isLoading, error };
}

