"use client";

import Image from "next/image";
import { useUserProfile } from "@/hooks/use-user-profile";
import { ProfileSkeleton } from "@/components/page-skeletons/profile-skeleton";
import CustomAlertComponent from "@/components/custom-alert-component";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, ExternalLink, Users, MapPin, Music2, TrendingUp } from "lucide-react";
import { getRandomAvatar } from "@/lib/utils";
import ViewHint from "@/components/view-hint";
import StatCard from "@/components/stat-card";

export default function ProfilePage() {
  const { profile, topArtists, topTracks, isLoading, error } = useUserProfile();

  if (isLoading) return <ProfileSkeleton />;
  if (error || !profile) return <CustomAlertComponent variant="destructive" title="Error" description={error || "Failed to load profile. Please log in to view your profile."} />

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[400px] md:h-[500px] bg-gradient-to-b from-primary/20 to-background overflow-hidden">
        {profile.images?.[0]?.url && (
          <div className="absolute inset-0 opacity-30">
            <Image src={profile.images[0].url} alt={profile.display_name || "Profile"} fill className="object-cover blur-xl" priority draggable={false} />
          </div>
        )}

        <div className="relative h-full max-w-7xl mx-auto px-6 flex items-end pb-8">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 w-full">
            <div className="relative">
              <Avatar className="h-48 w-48 md:h-64 md:w-64 border-4 border-background shadow-2xl">
                <AvatarImage src={profile.images?.[0]?.url || getRandomAvatar()} alt={profile.display_name || "User"} draggable={false} />
                <AvatarFallback className="text-6xl">
                  <User className="h-24 w-24" />
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="flex-1 text-center md:text-left space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Profile</p>
                <h1 className="text-4xl md:text-6xl font-bold mb-4">{profile.display_name || "Spotify User"}</h1>
              </div>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm">
                {profile.email && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="font-semibold">{profile.email}</span>
                  </div>
                )}
                {profile.country && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span className="font-semibold">{profile.country}</span>
                  </div>
                )}
                {profile.followers && (
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span className="font-semibold">
                      {profile.followers.total?.toLocaleString() || 0} followers
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-3 justify-center md:justify-start pt-2">
                {profile.external_urls?.spotify && (
                  <Button asChild size="lg">
                    <a href={profile.external_urls.spotify} target="_blank" rel="noopener noreferrer" className="gap-2" >
                      <ExternalLink className="h-5 w-5" />
                      Open in Spotify
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        {/* Stats Cards */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard icon={Users} title="Total Followers" value={profile.followers?.total?.toLocaleString() || 0} tooltipDescription="People following your profile" />
            <StatCard icon={Music2} title="Top Artists" value={topArtists.length} tooltipDescription="Your most listened artists" />
            <StatCard icon={TrendingUp} title="Top Tracks" value={topTracks.length} tooltipDescription="Your favorite songs" />
            <StatCard icon={User} title="Account Type" value={profile.product.toUpperCase()} tooltipDescription="Premium or Free account" />
          </div>
        </section>

        {topArtists.length === 0 && topTracks.length === 0 && <ViewHint title="Start Listening!" description="Your top artists and tracks will appear here as you listen to more music on Spotify" icon={Music2} />}
      </div>
    </div>
  );
}

