"use client"

import Link from "next/link"
import { Fragment, useMemo } from "react"
import { usePathname } from "next/navigation"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

const SPORI_HOME = "/dashboard/overview"

const ROUTE_NAMES: Record<string, string> = {
  dashboard: "Dashboard",
  overview: "Overview",
  stats: "Your Stats",
  artists: "Artists",
  search: "Search",
  compare: "Compare",
  tracks: "Tracks",
  albums: "Albums",
  analysis: "Analysis",
  top: "Top",
  playlists: "Playlists",
  yours: "Your Playlists",
  dna: "DNA",
  insights: "Insights",
  trends: "Music Trends",
  genres: "Genre Explorer",
  facts: "Fun Facts",
  profile: "Profile",
} as const

const ID_LABELS: Record<string, string> = { 
  tracks: "Track Profile", 
  artists: "Artist Profile", 
  albums: "Album Profile", 
  playlists: "Playlist Profile",
} as const

const REDIRECT_MAP: Record<string, string> = {
  "/dashboard": SPORI_HOME,
  "/artists": "/artists/search",
  "/tracks": "/tracks/search",
  "/albums": "/albums/search",
  "/playlists": "/playlists/yours",
  "/insights": "/insights/facts",
} as const


const isLikelyId = (segment: string): boolean => {
  return segment.length > 10 && /^[a-zA-Z0-9_-]+$/.test(segment)
}

const getSegmentLabel = (segment: string, index: number, segments: string[]): string => {
  if (isLikelyId(segment) && index > 0) {
    const parentSegment = segments[index - 1]
    return ID_LABELS[parentSegment] || segment
  }
  return ROUTE_NAMES[segment] || segment
}

const shouldBeLink = (href: string, pathname: string, isLast: boolean): boolean => {
  if (isLast || href === pathname) return false
  return REDIRECT_MAP[href] !== pathname
}

interface BreadcrumbSegment {
  segment: string
  label: string
  href: string
  isLink: boolean
}

export function DynamicBreadcrumb() {
  const pathname = usePathname()

  const breadcrumbData = useMemo(() => {
    if (pathname === "/") return { isHome: true, segments: [] as BreadcrumbSegment[], isOnSporiHome: false }

    const pathSegments = pathname.split("/").filter(Boolean)
    const isOnSporiHome = pathname === SPORI_HOME

    const segments: BreadcrumbSegment[] = pathSegments.map((segment, index) => {
      const label = getSegmentLabel(segment, index, pathSegments)
      const href = "/" + pathSegments.slice(0, index + 1).join("/")
      const isLast = index === pathSegments.length - 1
      const isLink = shouldBeLink(href, pathname, isLast)
      return { segment, label, href, isLink }
    })

    return { isHome: false, segments, isOnSporiHome }
  }, [pathname])

  if (breadcrumbData.isHome) {
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

  const { segments, isOnSporiHome } = breadcrumbData

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          {isOnSporiHome ? (
            <BreadcrumbPage>Spori</BreadcrumbPage>
          ) : (
            <BreadcrumbLink asChild>
              <Link href={"/"}>Spori</Link>
            </BreadcrumbLink>
          )}
        </BreadcrumbItem>
        
        {segments.map(({ segment, label, href, isLink }) => (
          <Fragment key={segment}>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              {isLink ? (
                <BreadcrumbLink asChild>
                  <Link href={href}>{label}</Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}