"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function ArtistProfileSkeleton() {
  return (
    <div className="min-h-screen">
      {/* Hero Section Skeleton */}
      <div className="relative h-[400px] md:h-[500px] sm:rounded-tl-2xl rounded-none bg-gradient-to-b from-primary/20 to-background overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <Skeleton className="w-full h-full" />
        </div>
        
        <div className="relative h-full max-w-7xl mx-auto px-6 flex items-end pb-8">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 w-full">
            {/* Artist Image Skeleton */}
            <div className="relative">
              <Skeleton className="h-48 w-48 md:h-64 md:w-64 rounded-full border-2 border-background shadow-2xl" />
            </div>

            {/* Artist Info Skeleton */}
            <div className="flex-1 text-center md:text-left space-y-4 w-full md:w-auto">
              <div>
                <Skeleton className="h-4 w-16 mb-2 mx-auto md:mx-0" />
                <Skeleton className="h-16 md:h-20 w-64 md:w-80 mb-4 mx-auto md:mx-0" />
              </div>

              {/* Stats Skeleton */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>

              {/* Genres Skeleton */}
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>

              {/* Actions Skeleton */}
              <div className="flex gap-3 justify-center md:justify-start pt-2">
                <Skeleton className="h-12 w-40" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections Skeleton */}
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        {/* Top Tracks Skeleton */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Skeleton className="h-6 w-6 rounded" />
            <Skeleton className="h-8 w-48" />
          </div>
          
          {/* Desktop Table Skeleton */}
          <div className="hidden xl:block bg-card rounded-lg border overflow-hidden">
            <div className="overflow-x-auto">
              <div className="w-full">
                <div className="border-b bg-muted/50 p-3">
                  <Skeleton className="h-5 w-full" />
                </div>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="border-b p-3 flex items-center gap-3">
                    <Skeleton className="h-4 w-8" />
                    <Skeleton className="h-12 w-12 rounded" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-48" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-8 w-8 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile/Tablet Cards Skeleton */}
          <div className="xl:hidden grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-card rounded-lg border overflow-hidden">
                <Skeleton className="aspect-square w-full" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="flex gap-2 pt-2">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Albums Skeleton */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Skeleton className="h-6 w-6 rounded" />
            <Skeleton className="h-8 w-48" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="bg-card rounded-lg overflow-hidden border">
                <Skeleton className="aspect-square w-full" />
                <div className="p-3 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-3 w-3 rounded" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Related Artists Skeleton */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Skeleton className="h-6 w-6 rounded" />
            <Skeleton className="h-8 w-48" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="bg-card rounded-lg p-4 text-center">
                <Skeleton className="h-24 w-24 rounded-full mx-auto mb-3" />
                <Skeleton className="h-5 w-3/4 mx-auto" />
                <Skeleton className="h-3 w-1/2 mx-auto mt-2" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

