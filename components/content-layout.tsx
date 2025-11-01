"use client"

import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { DynamicBreadcrumb } from "@/components/dynamic-breadcrumb"
import { ModeToggle } from "@/components/ui/mode-toggle"
import { useSpotifySession } from "@/contexts/spotify-session-context"
import LoginToGetTokenMessage from "@/components/login-to-get-token"
import { Spinner } from "@/components/ui/spinner"

interface ContentLayoutProps {
  children: React.ReactNode
}

export function ContentLayout({ children }: ContentLayoutProps) {
  const { session, loading, login } = useSpotifySession()
  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4 justify-between w-full">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <DynamicBreadcrumb />
          </div>
          <ModeToggle />
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min">
          <main>
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <Spinner className="size-10" />
              </div>
            ) : session.authenticated ? (
              children
            ) : (
              <LoginToGetTokenMessage onLogin={login} />
            )}
          </main>
        </div>
      </div>
    </SidebarInset>
  )
}

