"use client"

import { ReactNode } from "react";
import { SidebarInset } from "@/components/ui/sidebar";
import { useSpotifySession } from "@/contexts/spotify-session-context";
import { AppHeader } from "./app-header";
import LoginToGetTokenMessage from "@/components/login-to-get-token";
import LoadingComponent from "./loading-component";
import AppHeaderSkeleton from "./page-skeletons/app-header-skeleton";

export function ContentLayout({children}: {children: ReactNode}) {
  const { session, loading:loadingSession } = useSpotifySession();

  return (
    <SidebarInset>
      <div className="position-fixed top-0 left-0 right-0 z-10">
        { session.authenticated ? <AppHeader /> : <AppHeaderSkeleton /> }
      </div>
      <div className="flex flex-1 flex-col sm:ml-4 bg-muted/50 min-h-[100vh] sm:rounded-tl-2xl rounded-none sm:rounded-r-none flex-1 md:min-h-min">
        <main>{ loadingSession ? <LoadingComponent /> : session.authenticated ? children : <LoginToGetTokenMessage /> }</main>
      </div>
    </SidebarInset>
  );
};