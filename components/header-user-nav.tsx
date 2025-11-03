"use client";

import { useSpotifySession } from "@/contexts/spotify-session-context";
import { SpotifyUserProfile } from "@/lib/spotify";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { usePathname, useRouter } from "next/navigation";
import CustomAvatarComponent from "./custom-avatar-component";
import { LogOut, User, Settings, HelpCircle, Music } from "lucide-react";
import { Badge } from "./ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

export function HeaderUserNav() {
  const { session, loading, login } = useSpotifySession();
  const [localUser, setLocalUser] = useState<SpotifyUserProfile | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (session.authenticated && session.profile) {
      setLocalUser(session.profile as SpotifyUserProfile);
    }
  }, [session.authenticated, session.profile]);

  const handleLogout = () => {
    const origin = window.location.origin || "http://127.0.0.1:3000";
    window.location.href = `${origin}/api/spotify/logout`;
  };

  const handleGoToProfile = () => {
    if (pathname === '/profile') return;
    router.push('/profile');
  };

  if (!localUser?.id) {
    return (
      <Button onClick={login} variant="default" size="sm">
        <Music className="mr-2 h-4 w-4" />
        Login with Spotify
      </Button>
    );
  }

  return (
    <TooltipProvider>
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <CustomAvatarComponent image={localUser?.images?.[0]?.url} name={localUser?.display_name || "User"} loading={loading} className="h-9 w-9" />
                {session.authenticated && <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-background" /> }
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p className="text-xs">
              {loading ? "Loading..." : localUser?.display_name}
            </p>
          </TooltipContent>
        </Tooltip>

        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{loading ? "Loading..." : localUser?.display_name}</p>
              <p className="text-xs leading-none text-muted-foreground">{loading ? "Loading..." : localUser?.email}</p>
              <div className="flex items-center gap-2 pt-1">
                <Badge variant="secondary" className="text-xs">
                  <Music className="mr-1 h-3 w-3" />
                  {localUser?.product.toUpperCase() || "FREE"}
                </Badge>
                {session.authenticated && <Badge variant="default" className="text-xs bg-green-500">Connected</Badge>}
              </div>
            </div>
          </DropdownMenuLabel>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={handleGoToProfile} className="cursor-pointer" >
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => router.push('/dashboard')} className="cursor-pointer" >
              <Settings className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => window.open('https://www.spotify.com/account', '_blank')} className="cursor-pointer" >
              <HelpCircle className="mr-2 h-4 w-4" />
              <span>Spotify Account</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive" >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>

        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  );
}