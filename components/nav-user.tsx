"use client";

import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, } from "@/components/ui/sidebar";
import { LogOut, User, EllipsisVertical } from "lucide-react";
import { useSpotifySession } from "@/contexts/spotify-session-context";
import { SpotifyUserProfile } from "@/lib/spotify";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
import { usePathname, useRouter } from "next/navigation";
import CustomAvatarComponent from "./custom-avatar-component";

export function NavUser() {
  const {session, loading, login} = useSpotifySession();
  const [localUser, setLocalUser] = useState<SpotifyUserProfile | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (session.authenticated && session.profile) setLocalUser(session.profile as SpotifyUserProfile);
  }, [session.authenticated, session.profile]);

  const handleLogout = () => {
    const origin = window.location.origin || "http://127.0.0.1:3000";
    window.location.href = `${origin}/api/spotify/logout`;
  };

  const handleGoToProfile = () => {
    if (pathname === '/profile') return;
    router.push('/profile');
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        {localUser?.id ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer" >
                <CustomAvatarComponent image={localUser?.images?.[0]?.url} name={localUser?.display_name || "User"} loading={loading} className="size-10" />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{loading ? "Username..." : localUser?.display_name}</span>
                  <span className="truncate text-xs">{loading ? "Email..." : localUser?.email}</span>
                </div>
                <EllipsisVertical className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg p-2" side="top" align="center" sideOffset={4} >
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={handleGoToProfile} className="cursor-pointer hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                  <User className="size-4" />
                  Go to Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} variant="destructive" className="cursor-pointer hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                  <LogOut className="size-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
