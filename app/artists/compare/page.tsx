"use client";

import { GitCompareArrows } from "lucide-react";
import { useArtistComparison } from "@/hooks/use-artist-comparison";
import IconTitle from "@/components/icon-title";
import ArtistSelector from "@/components/artist-selector";
import WinnerCards from "@/components/winner-cards";
import TopTracksComparison from "@/components/top-tracks-comparison";
import ComparisonTable from "@/components/comparison-table";
import LoadingComponent from "@/components/loading-component";
import CustomAlertComponent from "@/components/custom-alert-component";
import ViewHint from "@/components/view-hint";

export default function ArtistsComparePage() {
  const { selectedArtists, comparisonData, loading, error, addArtist, removeArtist, canAddMore, commonGenres, uniqueGenres } = useArtistComparison();

  return (
    <div className="p-6 space-y-6">
      <IconTitle icon={GitCompareArrows} title="Compare Artists" subtitle="Compare your favorite artists and see how they compete " />

      <div className="space-y-6">
        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-3">Select Artists to Compare (Max 3)</h2>
          <ArtistSelector selectedArtists={selectedArtists} onAddArtist={addArtist} onRemoveArtist={removeArtist} canAddMore={canAddMore} />
        </div>

        { !loading && !error && comparisonData.length > 0 && (
          <div className="space-y-6">
            <ComparisonTable comparisonData={comparisonData} commonGenres={commonGenres} uniqueGenres={uniqueGenres} />
            <WinnerCards comparisonData={comparisonData} />
            <TopTracksComparison comparisonData={comparisonData} />
          </div>
        )}

        { loading && <LoadingComponent message="Loading artist data..." /> }
        { error && <CustomAlertComponent title="Oops! Something went wrong" description={error} variant="destructive" /> }
        { !loading && !error && selectedArtists.length === 0 && <ViewHint title="Compare Your Favorite Artists" description="Select 2-3 artists to see how they compare" icon={GitCompareArrows} /> }
        { !loading && !error && selectedArtists.length === 1 && <ViewHint title="Add More Artists" description="Select at least one more artist to start comparing" icon={GitCompareArrows}/> }
      </div>
    </div>
  );
}