'use client'

import { useState, useEffect, useMemo } from 'react'
import { SidebarTrigger } from './ui/sidebar'
import { DynamicBreadcrumb } from './dynamic-breadcrumb'
import { ThemeToggler } from './ui/theme-toggler'
import { HeaderUserNav } from './header-user-nav'
import { QuickSearchButton } from './quick-search-button'
import AppHeaderSkeleton from './page-skeletons/app-header-skeleton'

export function AppHeader({authenticated, loading}: {authenticated: boolean, loading: boolean}) {
  // Creamos una key única basada en el estado de loading y authenticated
  const stateKey = useMemo(() => `${loading}-${authenticated}`, [loading, authenticated]);
  
  const [timeoutCompleted, setTimeoutCompleted] = useState(false);
  const [currentStateKey, setCurrentStateKey] = useState(stateKey);

  // Cuando la key cambia, reseteamos el timeout
  if (currentStateKey !== stateKey) {
    setCurrentStateKey(stateKey);
    setTimeoutCompleted(false);
  }

  useEffect(() => {
    // Solo configuramos timeout si no está cargando y no está autenticado
    if (!loading && !authenticated) {
      const timer = setTimeout(() => {
        setTimeoutCompleted(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [loading, authenticated]);

  // Determinamos si mostrar skeleton
  const shouldShowSkeleton = loading || (!authenticated && !timeoutCompleted);

  if (shouldShowSkeleton) {
    return <AppHeaderSkeleton />;
  }

  // Si no está autenticado y ya esperamos suficiente, mostramos el header sin contenido de usuario
  if (!authenticated) {
    return (
      <header className="flex h-14 shrink-0 items-center transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-14 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-2 px-3 sm:px-4 justify-between w-full">
          <div className="flex items-center gap-3 sm:gap-3 flex-1 min-w-0">
            <SidebarTrigger className="h-9 w-9 shrink-0" />
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <ThemeToggler />
          </div>
        </div>
      </header>
    );
  }

  // Header completo para usuarios autenticados
  return (
    <header className="flex h-14 shrink-0 items-center transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-14 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-2 px-3 sm:px-4 justify-between w-full">
        <div className="flex items-center gap-3 sm:gap-3 flex-1 min-w-0">
          <SidebarTrigger className="h-9 w-9 shrink-0" />
          <div className="min-w-0 flex-1 hidden sm:block">
            <DynamicBreadcrumb />
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <QuickSearchButton />
          <ThemeToggler />
          <HeaderUserNav />
        </div>
      </div>
    </header>
  );
};