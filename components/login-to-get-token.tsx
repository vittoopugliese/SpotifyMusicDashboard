"use client";

import { useSpotifySession } from "@/contexts/spotify-session-context";
import { Button } from "@/components/ui/button";
import { AudioWaveform, BarChart3, Music, TrendingUp, Users, Album, Sparkles, ArrowRight, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import FeatureCard from "@/components/feature-card";

export default function LoginToGetTokenMessage() {
  const { session, loading, login } = useSpotifySession();
  const router = useRouter();
  const isMobile = useIsMobile();

  useEffect(() => {
    // if (!loading && session.authenticated) router.push("/dashboard/overview");
  }, [session.authenticated, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <AudioWaveform className="w-12 h-12 text-primary animate-pulse" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const features = [
    {
      icon: BarChart3,
      title: "Detailed Analytics",
      description: "Get deep insights into your listening habits with comprehensive stats and visualizations."
    },
    {
      icon: TrendingUp,
      title: "Music Trends",
      description: "Discover patterns in your music taste and see how it evolves over time."
    },
    {
      icon: Users,
      title: "Artist Comparison",
      description: "Compare your favorite artists and discover similarities between them."
    },
    {
      icon: Album,
      title: "Playlist DNA",
      description: "Analyze your playlists to understand their unique characteristics and mood."
    },
    {
      icon: Music,
      title: "Track Insights",
      description: "Explore audio features and get recommendations based on your favorite songs."
    },
    {
      icon: Sparkles,
      title: "Fun Facts",
      description: "Learn interesting facts about your music library and listening patterns."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/25 via-background to-black/80">
      <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32">
        <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
          <div className="relative">
            <div className="absolute inset-0 blur-3xl opacity-30 bg-primary rounded-full animate-pulse" />
            <AudioWaveform className="w-20 h-20 md:w-24 md:h-24 text-primary relative z-10" />
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight">
              Welcome to{" "}
              <span className="text-primary bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
                Spori
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">Your personal music analytics dashboard</p>
            <p className="text-xs md:text-lg text-muted-foreground max-w-2xl mx-auto">Discover insights about your listening habits, explore your favorite artists, and understand your music taste like never before</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button size="lg" onClick={login} className="text-lg px-8 py-6 group" >
              <AudioWaveform className="w-5 h-5 mr-2" />
              Connect with Spotify
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            Secure OAuth authentication powered by Spotify
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Unlock the full potential of your Spotify data with our comprehensive suite of tools</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => <FeatureCard key={index} icon={feature.icon} title={feature.title} description={feature.description} index={index} />)}
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-primary/10 via-chart-2/10 to-primary/10 border border-primary/20 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to explore your music?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">Connect your Spotify account and start discovering insights about your music taste today.</p>
          <Button size="lg" onClick={login} className="text-lg px-8 py-6" >
            Get Started Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>

      { isMobile ? (
          <div className="container mx-auto px-4 py-8 border-t border-border">
          <p className="text-center text-lg text-muted-foreground flex items-center justify-center gap-2">
            With <Heart className="w-4 h-4 inline-block text-red-500 hover:text-red-700 animate-pulse" /> by Vittorio </p>
        </div> ): (
          <div className="container mx-auto px-4 py-8 border-t border-border">
            <p className="text-center text-lg text-muted-foreground flex items-center justify-center gap-2">
              Built with <Heart className="w-4 h-4 inline-block text-red-500 hover:text-red-700 animate-pulse" /> by Vittorio using Next.js with ShadCN UI and the Spotify Web API
            </p>
          </div>
        )
      }
    </div>
  );
}