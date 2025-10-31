"use client";

import IconTitle from "@/components/icon-title";
import { GitCompareArrows } from "lucide-react";
import ArtistSelector from "@/components/artist-selector";
import { useArtistComparison } from "@/hooks/use-artist-comparison";
import WinnerCards from "@/components/winner-cards";
import TopTracksComparison from "@/components/top-tracks-comparison";
import { Spinner } from "@/components/ui/spinner";
import ComparisonTable from "@/components/comparison-table";

export default function ArtistsComparePage() {
  const { selectedArtists, comparisonData, loading, error, addArtist, removeArtist, canAddMore, commonGenres, uniqueGenres } = useArtistComparison();

  return (
    <div className="p-6 space-y-6">
      <IconTitle icon={<GitCompareArrows className="h-8 w-8" />} title="Compare Artists" subtitle="Compare your favorite artists and see how they compete " />

      <div className="space-y-6">
        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Select Artists to Compare (Max 3)</h2>
          <ArtistSelector selectedArtists={selectedArtists} onAddArtist={addArtist} onRemoveArtist={removeArtist} canAddMore={canAddMore} />
        </div>

        {loading && (
          <div className="flex items-center flex-col justify-center py-12">
            <Spinner className="size-9" />
            <p className="text-sm text-muted-foreground mt-2">Loading artist data...</p>
          </div>
        )}

        {error && <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-destructive">{error}</div>}

        {!loading && !error && comparisonData.length > 0 && (
          <div className="space-y-6">
            <ComparisonTable comparisonData={comparisonData} commonGenres={commonGenres} uniqueGenres={uniqueGenres} />
            <WinnerCards comparisonData={comparisonData} />
            <TopTracksComparison comparisonData={comparisonData} />
          </div>
        )}

        {!loading && !error && selectedArtists.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <GitCompareArrows className="h-16 w-16 mb-4" />
            <p className="text-lg mb-1 font-bold">Compare Your Favorite Artists</p>
            <p className="text-sm">Select 2-3 artists to see how they compare</p>
          </div>
        )}

        {!loading && !error && selectedArtists.length === 1 && (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <GitCompareArrows className="h-16 w-16 mb-4" />
            <p className="text-lg mb-1 font-bold">Add More Artists</p>
            <p className="text-sm">Select at least one more artist to start comparing</p>
          </div>
        )}
      </div>
    </div>
  );
}