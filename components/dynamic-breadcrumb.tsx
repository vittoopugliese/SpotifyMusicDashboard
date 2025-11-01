"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, } from "@/components/ui/breadcrumb"

const routeNames: Record<string, string> = {
  dashboard: "Dashboard",
  overview: "Overview",
  stats: "Your Stats",
  artists: "Artists",
  search: "Search Artists",
  compare: "Compare Artists",
  tracks: "Tracks & Albums",
  analysis: "Track Analysis",
  top: "Top Tracks",
  playlists: "Playlists",
  yours: "Your Playlists",
  dna: "Playlist DNA",
  insights: "Insights",
  trends: "Music Trends",
  genres: "Genre Explorer",
  facts: "Fun Facts",
}

export function DynamicBreadcrumb() {
  const pathname = usePathname()
  if (pathname === "/") {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Home</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )
  }

  const pathSegments = pathname.split("/").filter(Boolean)

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink asChild>
            <Link href="/dashboard/overview">Spori | Music Dashboard</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        
        {pathSegments.map(segment => {
          const label = routeNames[segment] || segment

          return (
            <React.Fragment key={segment}>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{label}</BreadcrumbPage>
              </BreadcrumbItem>
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

