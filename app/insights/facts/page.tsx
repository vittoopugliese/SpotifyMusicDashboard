"use client";

import { useState } from "react";
import { Radio, Sparkles, Music, Target, Lightbulb, Heart, Timer, TrendingUp, Activity, LucideIcon, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTopTracks as useTopTracksData } from "@/hooks/use-top-tracks";
import { useTopArtists } from "@/hooks/use-spotify-data";
import { useUserPlaylists } from "@/hooks/use-user-playlists";
import { SpotifyTrack } from "@/lib/spotify";
import IconTitle from "@/components/icon-title";
import FactCard from "@/components/fact-card";
import LoadingComponent from "@/components/loading-component";

type Fact = {
  icon: LucideIcon;
  category: string;
  fact: string;
  id: string;
};

export default function FactsPage() {
  const [facts, setFacts] = useState<Fact[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const { tracks: userTracks, isLoading: tracksLoading } = useTopTracksData();
  const { data: artistsData, loading: artistsLoading } = useTopArtists("medium_term");
  const { playlists, isLoading: playlistsLoading } = useUserPlaylists();

  const generateFact = async () => {
    if (tracksLoading || artistsLoading || playlistsLoading) return;
    
    setIsGenerating(true);
    
    try {
      const fact = await generateRandomFact();
      if (fact) setFacts(prev => [fact, ...prev]);
    } catch (error) {
      console.error("Error generating fact:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateRandomFact = async (): Promise<Fact | null> => {
    const categoryChoices = [() => generateYourMusicFact(), () => generateArtistQuirksFact(), () => generatePlaylistInsightsFact(), () => generateGlobalComparisonsFact()];
    return categoryChoices[Math.floor(Math.random() * categoryChoices.length)](); // random category function call
  };

  const generateYourMusicFact = (): Fact => {
    const decades = new Set<string>();
    const years = new Set<number>();
    const artists = new Set<string>();
    const genres = new Map<string, number>();
    
    userTracks.forEach(track => {
      const year = parseInt(track.album.release_date.substring(0, 4));
      years.add(year);
      const decade = Math.floor(year / 10) * 10;
      decades.add(`${decade}s`);
      track.artists.forEach(artist => artists.add(artist.name));
    });

    // Collect genres from top artists
    artistsData?.items?.forEach(artist => artist.genres.forEach(genre => genres.set(genre, (genres.get(genre) || 0) + 1)));

    const totalDuration = userTracks.reduce((sum, t) => sum + t.duration_ms, 0);
    const hours = Math.round((totalDuration / 60000 / 60) * 10) / 10;
    const avgDuration = totalDuration / userTracks.length / 1000 / 60;

    const facts = [];

    if (decades.size > 0) facts.push({ icon: Calendar, category: "Your Music", fact: `You've listened to tracks from ${decades.size} different decades`, id: `decades-${Date.now()}`, });
    if (years.size > 0) facts.push({ icon: TrendingUp, category: "Your Music", fact: `Your music collection spans from ${Math.min(...Array.from(years))} to ${Math.max(...Array.from(years))}`, id: `span-${Date.now()}`, });
    if (userTracks.length > 0 && hours > 0) facts.push({ icon: Timer, category: "Your Music", fact: `If you played all your top tracks back-to-back, it would take ${hours} hours`, id: `duration-${Date.now()}`, });
    if (userTracks.length > 0) facts.push({ icon: Music, category: "Your Music", fact: `Your average track length is ${Math.round(avgDuration)} minutes`, id: `avg-duration-${Date.now()}`, });
    if (artists.size > 0) facts.push({ icon: Users, category: "Your Music", fact: `You listen to music from ${artists.size} unique artists`, id: `artists-${Date.now()}`, });

    // Find most common genre
    if (genres.size > 0) {
      const topGenre = Array.from(genres.entries()).sort((a, b) => b[1] - a[1])[0];
      const genrePercentage = Math.round((topGenre[1] / (artistsData?.items?.length || 1)) * 100);
      facts.push({ icon: Music, category: "Your Music", fact: `${genrePercentage}% of your top artists make ${topGenre[0]} music`, id: `genre-${Date.now()}`, });
    }

    // Calculate popularity stats
    if (userTracks.length > 0) {
      const avgPopularity = userTracks.reduce((sum, t) => sum + t.popularity, 0) / userTracks.length;
      const popularTracks = userTracks.filter(t => t.popularity >= 70).length;
      
      facts.push({ icon: TrendingUp, category: "Your Music", fact: `Your average track popularity is ${Math.round(avgPopularity)}/100`, id: `popularity-${Date.now()}`, });

      if (popularTracks > 0) {
        const popPercentage = Math.round((popularTracks / userTracks.length) * 100);
        facts.push({ icon: Target, category: "Your Music", fact: `${popPercentage}% of your top tracks are mainstream hits (70+ popularity)`, id: `mainstream-${Date.now()}`, });
      }
    }

    return facts[Math.floor(Math.random() * facts.length)];
  };

  const generateArtistQuirksFact = async (): Promise<Fact | null> => {
    if (!artistsData?.items || artistsData.items.length === 0) return null;

    const randomArtist = artistsData.items[Math.floor(Math.random() * artistsData.items.length)];

    // Fetch artist top tracks to analyze
    const artistTracksRes = await fetch(`/api/spotify/artist/${randomArtist.id}/top-tracks?market=US`);
    if (!artistTracksRes.ok) return null;
    
    const artistTracksData: { tracks?: SpotifyTrack[] } = await artistTracksRes.json();
    const artistTracks = artistTracksData.tracks?.slice(0, 20) || [];
    
    if (artistTracks.length === 0) return null;

    const facts = [];

    // Analyze track durations
    const totalDuration = artistTracks.reduce((sum, t) => sum + t.duration_ms, 0);
    const avgDuration = totalDuration / artistTracks.length / 1000 / 60;

    if (artistTracks.length > 0) facts.push({ icon: Timer, category: "Artist Quirks", fact: `${randomArtist.name}'s average track is ${Math.round(avgDuration)} minutes long`, id: `duration-${Date.now()}`, });

    // Genre analysis
    if (randomArtist.genres.length > 0) facts.push({ icon: Music, category: "Artist Quirks", fact: `${randomArtist.name} is known for ${randomArtist.genres.slice(0, 2).join(" and ")} music`, id: `genres-${Date.now()}`, });

    // Popularity analysis
    if (artistTracks.length > 0) {
      const avgPopularity = artistTracks.reduce((sum, t) => sum + t.popularity, 0) / artistTracks.length;
      facts.push({ icon: TrendingUp, category: "Artist Quirks", fact: `${randomArtist.name}'s top tracks average a popularity of ${Math.round(avgPopularity)}/100`, id: `popularity-${Date.now()}`, });
      // Count hits
      const hits = artistTracks.filter(t => t.popularity >= 70).length;
      if (hits > 0) {
        const hitPercentage = Math.round((hits / artistTracks.length) * 100);
        facts.push({ icon: Target, category: "Artist Quirks", fact: `${randomArtist.name} has ${hitPercentage}% of their top tracks as mainstream hits`, id: `hits-${Date.now()}`, });
      }
    }

    // Followers analysis
    if (randomArtist.followers && randomArtist.followers.total > 1000000) {
      const millions = (randomArtist.followers.total / 1000000).toFixed(1);
      facts.push({ icon: Users, category: "Artist Quirks", fact: `${randomArtist.name} has over ${millions} million Spotify followers`, id: `followers-${Date.now()}`, });
    }

    return facts[Math.floor(Math.random() * facts.length)];
  };

  const generatePlaylistInsightsFact = async (): Promise<Fact | null> => {
    if (!playlists || playlists.length === 0) return null;

    const randomPlaylist = playlists[Math.floor(Math.random() * playlists.length)];
    
    // Fetch playlist tracks
    const tracksRes = await fetch(`/api/spotify/playlist/${randomPlaylist.id}/tracks?limit=100`);
    if (!tracksRes.ok) return null;
    
    const tracksData: { items?: Array<{ track: SpotifyTrack | null }> } = await tracksRes.json();
    const playlistTracks = tracksData.items?.map((item) => item.track).filter((t: SpotifyTrack | null) => t !== null) as SpotifyTrack[] || [];
    
    if (playlistTracks.length === 0) return null;

    const facts = [];

    // Track count
    if (playlistTracks.length > 0) facts.push({ icon: Music, category: "Playlist Insights", fact: `Your '${randomPlaylist.name}' playlist has ${playlistTracks.length} tracks`, id: `count-${Date.now()}`, });

    // Total duration
    const totalDuration = playlistTracks.reduce((sum, t) => sum + t.duration_ms, 0);
    const hours = totalDuration / 60000 / 60;

    facts.push({ icon: Timer, category: "Playlist Insights", fact: `Your '${randomPlaylist.name}' playlist would take ${Math.round(hours * 10) / 10} hours to play completely`, id: `duration-${Date.now()}`, });

    // Unique artists
    const uniqueArtists = new Set<string>();
    playlistTracks.forEach(track => track.artists.forEach(artist => uniqueArtists.add(artist.name)) );

    if (uniqueArtists.size > 0) {
      const avgTracksPerArtist = playlistTracks.length / uniqueArtists.size;
      facts.push({ icon: Users, category: "Playlist Insights", fact: `Your '${randomPlaylist.name}' playlist features ${uniqueArtists.size} unique artists`, id: `artists-${Date.now()}`, });
      if (avgTracksPerArtist > 2) facts.push({ icon: Target, category: "Playlist Insights", fact: `Your '${randomPlaylist.name}' playlist has an average of ${Math.round(avgTracksPerArtist)} tracks per artist`, id: `avg-tracks-${Date.now()}`, });
    }

    // Popularity analysis
    if (playlistTracks.length > 0) {
      const avgPopularity = playlistTracks.reduce((sum, t) => sum + t.popularity, 0) / playlistTracks.length;
      const highPopTracks = playlistTracks.filter(t => t.popularity >= 70).length;
      
      facts.push({ icon: TrendingUp, category: "Playlist Insights", fact: `Your '${randomPlaylist.name}' playlist has an average popularity of ${Math.round(avgPopularity)}/100`, id: `popularity-${Date.now()}`, });

      if (highPopTracks > playlistTracks.length * 0.5) {
        facts.push({ icon: Target, category: "Playlist Insights", fact: `Over half of '${randomPlaylist.name}' consists of mainstream hits`, id: `mainstream-${Date.now()}`, });
      } else {
        facts.push({ icon: Lightbulb, category: "Playlist Insights", fact: `'${randomPlaylist.name}' is a mix of mainstream hits and hidden gems`, id: `eclectic-${Date.now()}`, });
      }
    }

    return facts[Math.floor(Math.random() * facts.length)];
  };

  const generateGlobalComparisonsFact = (): Fact => {
    const globalFacts = [
      { icon: Heart, category: "Global Comparisons", fact: "The most streamed song on Spotify has been played over 4 billion times", id: `streamed-${Date.now()}`, },
      { icon: Timer, category: "Global Comparisons", fact: "The longest track on Spotify is over 63 hours long (768 minutes)", id: `longest-${Date.now()}`, },
      { icon: Activity, category: "Global Comparisons", fact: "The average song tempo on Spotify is 120 BPM", id: `tempo-${Date.now()}`, },
      { icon: Target, category: "Global Comparisons", fact: "Most popular songs have a popularity score above 70", id: `popularity-${Date.now()}`, },
      { icon: Users, category: "Global Comparisons", fact: "The most followed artist on Spotify has over 100 million followers", id: `followers-${Date.now()}`, },
      { icon: Music, category: "Global Comparisons", fact: "There are over 100 million tracks available on Spotify", id: `tracks-${Date.now()}`, },
    ];

    return globalFacts[Math.floor(Math.random() * globalFacts.length)];
  };

  const handleShare = async (fact: Fact) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Music Fact: ${fact.category}`,
          text: fact.fact,
        });
      } catch {
        // User cancelled or sharing failed
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(fact.fact);
    }
  };

  const isLoading = tracksLoading || artistsLoading || playlistsLoading;

  const ActionButton = () => {
    return (
      <Button onClick={generateFact} disabled={isGenerating || isLoading} size="lg" className="min-w-[200px]">
        <Sparkles className="h-5 w-5" />
        {isGenerating ? "Generating..." : "Generate Fact"}
      </Button>
    )
  };

  return (
    <div className="p-6 space-y-6">
      <IconTitle icon={Radio} title="Facts" subtitle="Discover interesting facts about your music taste" action={<ActionButton />} />

      {facts.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Generated Facts</h2>
          {facts.map((fact) => <FactCard key={fact.id} icon={fact.icon} category={fact.category} fact={fact.fact} onShare={() => handleShare(fact)} />)}
        </div>
      )}

      {isLoading && <LoadingComponent message="Loading your music data..." />}
      
      {!isLoading && userTracks.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Music className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No music data available. Start listening to generate facts!</p>
        </div>
      )}
    </div>
  );
};