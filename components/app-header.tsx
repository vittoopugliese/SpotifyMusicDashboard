import { SidebarTrigger } from './ui/sidebar'
import { Separator } from './ui/separator'
import { DynamicBreadcrumb } from './dynamic-breadcrumb'
import { ThemeToggler } from './ui/theme-toggler'
import { HeaderUserNav } from './header-user-nav'
import { QuickSearchButton } from './quick-search-button'
import { useSpotifySession } from '@/contexts/spotify-session-context'

export function AppHeader() {
  const { session } = useSpotifySession();

  return (
    <header className="flex h-14 shrink-0 items-center transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-14 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-2 px-3 sm:px-4 justify-between w-full">
        {/* Left side - Always visible */}
        <div className="flex items-center gap-3 sm:gap-3 flex-1 min-w-0">
          <SidebarTrigger className="h-9 w-9 shrink-0" />
          { session.authenticated && (
            <div className="min-w-0 flex-1">
              <DynamicBreadcrumb />
            </div>
          )}
        </div>

        {/* Right side - Responsive layout */}
        <div className="flex items-center gap-3 shrink-0">
          { session.authenticated && <QuickSearchButton /> }
          <ThemeToggler />
          <HeaderUserNav />
        </div>
      </div>
    </header>
  )
}