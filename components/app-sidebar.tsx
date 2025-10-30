"use client"

import { AudioWaveform, Bot, GalleryVerticalEnd, PieChart, SquareTerminal } from "lucide-react"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail, } from "@/components/ui/sidebar"
import { TeamSwitcher } from "./team-switcher"

const data = {
  teams: [ { name: "Spotify Music Dashboard", logo: AudioWaveform, plan: "Music Analytics", }, ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard/overview",
      icon: SquareTerminal,
      isActive: true,
      items: [
        { title: "Overview", url: "/dashboard/overview", },
        { title: "Your Stats", url: "/dashboard/stats", },
      ],
    },
    {
      title: "Artists",
      url: "/artists",
      icon: Bot,
      items: [
        { title: "Search Artists", url: "/artists/search", },
        { title: "Compare Artists", url: "/artists/compare", },
      ],
    },
    {
      title: "Tracks & Albums",
      url: "/tracks",
      icon: AudioWaveform,
      items: [
        { title: "Track Analysis", url: "/tracks/analysis", },
        { title: "Top Tracks", url: "/tracks/top", },
      ],
    },
    {
      title: "Playlists",
      url: "/playlists",
      icon: GalleryVerticalEnd,
      items: [
        { title: "Your Playlists", url: "/playlists/yours", },
        { title: "Playlist DNA", url: "/playlists/dna", },
      ],
    },
    {
      title: "Insights",
      url: "/insights",
      icon: PieChart,
      items: [
        { title: "Music Trends", url: "/insights/trends", },
        { title: "Genre Explorer", url: "/insights/genres", },
        { title: "Fun Facts", url: "/insights/facts", },
      ],
    },
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
