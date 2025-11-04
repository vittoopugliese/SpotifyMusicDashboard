'use client'

import { useReducer, useEffect, memo } from 'react'
import { SidebarTrigger } from './ui/sidebar'
import { DynamicBreadcrumb } from './dynamic-breadcrumb'
import { ThemeToggler } from './ui/theme-toggler'
import { HeaderUserNav } from './header-user-nav'
import { QuickSearchButton } from './quick-search-button'
import AppHeaderSkeleton from './page-skeletons/app-header-skeleton'

interface AppHeaderProps {
  authenticated: boolean;
  loading: boolean;
}

interface DelayState {
  delayPassed: boolean;
  effectId: number;
}

type DelayAction = | { type: 'RESET'; effectId: number } | { type: 'DELAY_PASSED'; effectId: number };

function delayReducer(state: DelayState, action: DelayAction): DelayState {
  switch (action.type) {
    case 'RESET':
      return { delayPassed: false, effectId: action.effectId };
    case 'DELAY_PASSED':
      // Solo actualizar si el effectId coincide con el actual
      if (action.effectId === state.effectId) return { ...state, delayPassed: true };
      return state;
    default:
      return state;
  }
}

function AppHeaderComponent({ authenticated, loading }: AppHeaderProps) {
  const [state, dispatch] = useReducer(delayReducer, { delayPassed: false, effectId: 0, });

  useEffect(() => {
    // Generar un ID único para este ciclo de effect
    const thisEffectId = Date.now();
    // Resetear el estado para este nuevo ciclo
    dispatch({ type: 'RESET', effectId: thisEffectId });
    // Si está loading o autenticado, no configurar timeout
    if (loading || authenticated) return;
    // Configurar timeout de 2 segundos para usuarios no autenticados
    const timer = setTimeout(() => dispatch({ type: 'DELAY_PASSED', effectId: thisEffectId }) , 2000);

    return () => clearTimeout(timer);
  }, [authenticated, loading]);

  // Determinar si mostrar el skeleton
  if (loading || (!authenticated && !state.delayPassed)) return <AppHeaderSkeleton />;
  console.log(state);
  // Si no está autenticado, mostramos header simplificado
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

// Memoizamos el componente para evitar re-renders innecesarios
export const AppHeader = memo(AppHeaderComponent);