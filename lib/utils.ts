import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { SpotifyArtist } from "./spotify";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const timeRangeLabels: Record<"short_term" | "medium_term" | "long_term", string> = { short_term: "Last 4 weeks", medium_term: "6 months", long_term: "All time", };

export const getRandomAvatar = () => {
  const avatars = [ "https://www.svgrepo.com/show/384670/account-avatar-profile-user.svg", "https://www.svgrepo.com/show/384671/account-avatar-profile-user-14.svg", "https://www.svgrepo.com/show/384672/account-avatar-profile-user-7.svg", "https://www.svgrepo.com/show/384673/account-avatar-profile-user-5.svg", "https://www.svgrepo.com/show/384674/account-avatar-profile-user-11.svg", "https://www.svgrepo.com/show/384675/account-avatar-profile-user-2.svg", "https://www.svgrepo.com/show/384676/account-avatar-profile-user-6.svg", "https://www.svgrepo.com/show/384677/account-avatar-profile-user-12.svg", "https://www.svgrepo.com/show/384678/account-avatar-profile-user-9.svg", "https://www.svgrepo.com/show/384679/account-avatar-profile-user-3.svg", "https://www.svgrepo.com/show/384680/account-avatar-profile-user-4.svg", "https://www.svgrepo.com/show/384681/account-avatar-profile-user-16.svg", "https://www.svgrepo.com/show/384682/account-avatar-profile-user-10.svg", "https://www.svgrepo.com/show/384683/account-avatar-profile-user-8.svg", "https://www.svgrepo.com/show/384684/account-avatar-profile-user-15.svg", "https://www.svgrepo.com/show/384669/account-avatar-profile-user-13.svg", ];
  return avatars[Math.floor(Math.random() * avatars.length)];
};

// SPOTIFY UTILS 

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