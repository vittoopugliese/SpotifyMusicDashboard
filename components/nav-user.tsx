"use client";

import {Avatar, AvatarImage} from "@/components/ui/avatar";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, } from "@/components/ui/sidebar";
import {Spinner} from "./ui/spinner";
import {LogOut} from "lucide-react";
import {useSpotifySession} from "@/contexts/spotify-session-context";
import {SpotifyUserProfile} from "@/lib/spotify";
import {useEffect, useState} from "react";
import {Button} from "./ui/button";
import { getRandomAvatar } from "@/lib/utils";

export function NavUser() {
  const {session, loading, login} = useSpotifySession();
  const [localUser, setLocalUser] = useState<SpotifyUserProfile | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (session.authenticated && session.profile) setLocalUser(session.profile as SpotifyUserProfile);
  }, [session.authenticated, session.profile]);

  const handleLogout = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const origin = window.location.origin || "http://127.0.0.1:3000";
    window.location.href = `${origin}/api/spotify/logout`;
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        {localUser?.id ? (
          <>
            <SidebarMenuButton className="mb-2">
              <div className="flex items-center gap-2 justify-between w-full cursor-pointer" onClick={(e) => handleLogout(e)}>
                <div className="flex items-center">
                  <span>User Logout</span>
                </div>
                <LogOut className="size-4" />
              </div>
            </SidebarMenuButton>
            <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <Avatar className="h-8 w-8 rounded-lg">
                {loading ? (
                  <div className="flex items-center justify-center">
                    <Spinner className="size-6" />
                  </div>
                ) : (
                  <AvatarImage src={localUser?.images?.[0]?.url || getRandomAvatar()} alt={localUser?.display_name || "User"} draggable={false} />
                )}
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{loading ? "Username..." : localUser?.display_name}</span>
                <span className="truncate text-xs">{loading ? "Email..." : localUser?.email}</span>
              </div>
            </SidebarMenuButton>
          </>
        ) : (
          <div className="flex items-center justify-center mb-2">
            <Button onClick={login}>Login with Spotify</Button>
          </div>
        )}
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
