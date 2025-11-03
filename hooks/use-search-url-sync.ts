import { useEffect, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";

interface UseSearchUrlSyncOptions {
  paramName?: string;
}

interface UseSearchUrlSyncReturn {
  initialQuery: string;
  syncUrlWithQuery: (query: string) => void;
}

/**
 * Hook para sincronizar la URL con el query de búsqueda
 * Este hook NO maneja estado, solo proporciona utilidades para sync de URL
 */
export function useSearchUrlSync(options: UseSearchUrlSyncOptions = {}): UseSearchUrlSyncReturn {
  const { paramName = "q" } = options;
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchParamsRef = useRef(searchParams);
  const routerRef = useRef(router);

  // Mantener refs actualizadas
  useEffect(() => {
    searchParamsRef.current = searchParams;
    routerRef.current = router;
  }, [searchParams, router]);

  // Obtener query inicial desde URL
  const initialQuery = searchParams.get(paramName) || "";

  // Función para actualizar URL (con debounce) - ESTABLE, no cambia
  const syncUrlWithQuery = useCallback((query: string) => {
    if (urlUpdateTimeoutRef.current) {
      clearTimeout(urlUpdateTimeoutRef.current);
    }

    urlUpdateTimeoutRef.current = setTimeout(() => {
      const currentParams = searchParamsRef.current;
      const currentRouter = routerRef.current;
      const params = new URLSearchParams(currentParams.toString());
      
      if (query.trim()) {
        params.set(paramName, query.trim());
      } else {
        params.delete(paramName);
      }
      
      const newUrl = query.trim() ? `?${params.toString()}` : window.location.pathname;
      currentRouter.replace(newUrl, { scroll: false });
    }, 800); // Debounce más largo para URL
  }, [paramName]); // Solo paramName como dependencia, usa refs para el resto

  // Cleanup
  useEffect(() => {
    return () => {
      if (urlUpdateTimeoutRef.current) {
        clearTimeout(urlUpdateTimeoutRef.current);
      }
    };
  }, []);

  return { initialQuery, syncUrlWithQuery };
}