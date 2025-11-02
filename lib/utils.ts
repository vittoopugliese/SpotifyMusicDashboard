import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { SpotifyArtist, SpotifyPlaylist, SpotifyTrack } from "./spotify";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const timeRangeLabels: Record<"short_term" | "medium_term" | "long_term", string> = { short_term: "Last 4 weeks", medium_term: "6 months", long_term: "All time", };

// export const getRandomAvatar = () => {
//   const avatars = [ "https://www.svgrepo.com/show/384670/account-avatar-profile-user.svg", "https://www.svgrepo.com/show/384671/account-avatar-profile-user-14.svg", "https://www.svgrepo.com/show/384672/account-avatar-profile-user-7.svg", "https://www.svgrepo.com/show/384673/account-avatar-profile-user-5.svg", "https://www.svgrepo.com/show/384674/account-avatar-profile-user-11.svg", "https://www.svgrepo.com/show/384675/account-avatar-profile-user-2.svg", "https://www.svgrepo.com/show/384676/account-avatar-profile-user-6.svg", "https://www.svgrepo.com/show/384677/account-avatar-profile-user-12.svg", "https://www.svgrepo.com/show/384678/account-avatar-profile-user-9.svg", "https://www.svgrepo.com/show/384679/account-avatar-profile-user-3.svg", "https://www.svgrepo.com/show/384680/account-avatar-profile-user-4.svg", "https://www.svgrepo.com/show/384681/account-avatar-profile-user-16.svg", "https://www.svgrepo.com/show/384682/account-avatar-profile-user-10.svg", "https://www.svgrepo.com/show/384683/account-avatar-profile-user-8.svg", "https://www.svgrepo.com/show/384684/account-avatar-profile-user-15.svg", "https://www.svgrepo.com/show/384669/account-avatar-profile-user-13.svg", ];
//   return avatars[Math.floor(Math.random() * avatars.length)];
// };

export function calculateAnalytics(tracks: SpotifyTrack[], playlist: SpotifyPlaylist) {
  if (!tracks || tracks.length === 0 || !playlist) return null;

  // Basic stats
  const totalDuration = tracks.reduce((sum, t) => sum + t.duration_ms, 0);
  const avgDuration = totalDuration / tracks.length;
  const trackCount = tracks.length;

  // Popularity analysis
  const avgPopularity = Math.round(average(tracks.map((t) => t.popularity)));
  const popularityDistribution = [
    { range: "0-20", count: tracks.filter((t) => t.popularity < 20).length },
    { range: "20-40", count: tracks.filter((t) => t.popularity >= 20 && t.popularity < 40).length },
    { range: "40-60", count: tracks.filter((t) => t.popularity >= 40 && t.popularity < 60).length },
    { range: "60-80", count: tracks.filter((t) => t.popularity >= 60 && t.popularity < 80).length },
    { range: "80-100", count: tracks.filter((t) => t.popularity >= 80).length },
  ];

  // Temporal analysis
  const years = tracks.map((t) => yearFromDate(t.album.release_date)).filter((y) => y > 0);
  const avgYear = Math.round(average(years));
  const oldestYear = Math.min(...years);
  const newestYear = Math.max(...years);

  const decadeCounts: Record<string, number> = {};
  years.forEach((year) => {
    const decade = `${Math.floor(year / 10) * 10}s`;
    decadeCounts[decade] = (decadeCounts[decade] || 0) + 1;
  });
  const decadeDistribution = Object.entries(decadeCounts)
    .map(([decade, count]) => ({ decade, count }))
    .sort((a, b) => a.decade.localeCompare(b.decade));

  // Artist analysis
  const artistCounts: Record<string, { count: number; name: string; image?: string }> = {};
  tracks.forEach((track) => {
    track.artists.forEach((artist) => {
      if (!artistCounts[artist.id]) {
        artistCounts[artist.id] = { count: 0, name: artist.name };
      }
      artistCounts[artist.id].count++;
    });
  });

  const topArtists = Object.entries(artistCounts)
    .map(([id, data]) => ({ id, ...data }))
    .sort((a, b) => b.count - a.count);

  const totalArtists = topArtists.length;
  const artistDiversity = Math.min(totalArtists / trackCount, 1);

  // Duration analysis
  const durationDistribution = [
    { range: "< 2 min", count: tracks.filter((t) => t.duration_ms < 120000).length },
    { range: "2-3 min", count: tracks.filter((t) => t.duration_ms >= 120000 && t.duration_ms < 180000).length },
    { range: "3-4 min", count: tracks.filter((t) => t.duration_ms >= 180000 && t.duration_ms < 240000).length },
    { range: "4-5 min", count: tracks.filter((t) => t.duration_ms >= 240000 && t.duration_ms < 300000).length },
    { range: "> 5 min", count: tracks.filter((t) => t.duration_ms >= 300000).length },
  ];

  // Outliers
  const sortedByDuration = [...tracks].sort((a, b) => a.duration_ms - b.duration_ms);
  const sortedByPopularity = [...tracks].sort((a, b) => a.popularity - b.popularity);

  const longest = sortedByDuration[sortedByDuration.length - 1];
  const shortest = sortedByDuration[0];
  const mostPopular = sortedByPopularity[sortedByPopularity.length - 1];
  const leastPopular = sortedByPopularity[0];

  // Personality generation
  const getPersonality = () => {
    let personality = "This playlist ";
    
    // Popularity aspect
    if (avgPopularity >= 70) {
      personality += "is packed with mainstream hits and chart-toppers, ";
    } else if (avgPopularity >= 40) {
      personality += "strikes a balance between popular tracks and hidden gems, ";
    } else {
      personality += "dives deep into underground and niche music, ";
    }

    // Era aspect
    if (avgYear >= 2018) {
      personality += "featuring contemporary sounds from the modern era. ";
    } else if (avgYear >= 2010) {
      personality += "showcasing the vibrant music scene of the 2010s. ";
    } else if (avgYear >= 2000) {
      personality += "bringing back the nostalgic vibes of the 2000s. ";
    } else {
      personality += "taking you on a journey through classic music history. ";
    }

    // Diversity aspect
    if (artistDiversity >= 0.6) {
      personality += "With a diverse range of artists, it's perfect for music exploration and discovery.";
    } else {
      personality += "It focuses on a curated selection of artists, reflecting strong musical preferences.";
    }

    return personality;
  };

  const getMood = () => {
    if (avgPopularity >= 70) return "Energetic & Mainstream";
    if (avgPopularity >= 40) return "Balanced & Eclectic";
    return "Alternative & Niche";
  };

  const getEra = () => {
    if (avgYear >= 2020) return "Modern (2020s)";
    if (avgYear >= 2010) return "Contemporary (2010s)";
    if (avgYear >= 2000) return "Millennial (2000s)";
    if (avgYear >= 1990) return "90s Nostalgia";
    if (avgYear >= 1980) return "80s Classic";
    return "Timeless Classics";
  };

  const getDiversity = () => {
    if (artistDiversity >= 0.8) return "Extremely Diverse";
    if (artistDiversity >= 0.6) return "Very Diverse";
    if (artistDiversity >= 0.4) return "Moderately Diverse";
    return "Focused Selection";
  };

  const analytics = {
    // Basic
    totalDuration,
    avgDuration,
    trackCount,
    
    // Popularity
    avgPopularity,
    popularityDistribution,
    
    // Temporal
    avgYear,
    oldestYear,
    newestYear,
    decadeDistribution,
    
    // Artists
    topArtists,
    totalArtists,
    artistDiversity,
    
    // Duration
    durationDistribution,
    
    // Outliers
    longest,
    shortest,
    mostPopular,
    leastPopular,
    
    // Personality
    personality: getPersonality(),
    mood: getMood(),
    era: getEra(),
    diversity: getDiversity(),
  };
  return analytics;
}
// SPOTIFY UTILS 

export function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}:${parseInt(seconds) < 10 ? "0" : ""}${seconds}`;
}

export function getDominantGenre(artists: SpotifyArtist[]): string {
  const genreCount: Record<string, number> = {};
  artists.forEach((artist) =>     artist.genres.forEach((genre) => genreCount[genre] = (genreCount[genre] || 0) + 1));
  const sorted = Object.entries(genreCount).sort((a, b) => b[1] - a[1]);
  return sorted[0]?.[0] || "Unknown";
}

export function getGenreDistribution(artists: SpotifyArtist[], topN = 5): Array<{ genre: string; count: number }> {
  const genreCount: Record<string, number> = {};
  artists.forEach((artist) => artist.genres.forEach((genre) => genreCount[genre] = (genreCount[genre] || 0) + 1));
  return Object.entries(genreCount).map(([genre, count]) => ({ genre, count })).sort((a, b) => b.count - a.count).slice(0, topN);
}

export function findCommonGenres(artist1Genres: string[], artist2Genres: string[]): string[] {
  return artist1Genres.filter(genre => artist2Genres.includes(genre));
}

export function findUniqueGenres(artistGenres: string[], otherArtistsGenres: string[][]): string[] {
  const allOtherGenres = otherArtistsGenres.flat();
  return artistGenres.filter(genre => !allOtherGenres.includes(genre));
}

export function average(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return numbers.reduce((a, b) => a + b, 0) / numbers.length;
}

export function yearFromDate(date: string): number {
  // Spotify dates can be YYYY or YYYY-MM or YYYY-MM-DD
  return Number(date.slice(0, 4));
}