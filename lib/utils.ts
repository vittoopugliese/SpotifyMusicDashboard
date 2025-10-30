import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const timeRangeLabels: Record<"short_term" | "medium_term" | "long_term", string> = { short_term: "Last 4 weeks", medium_term: "6 months", long_term: "All time", };