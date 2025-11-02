import { useEffect, useRef, useCallback, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";

interface UseSearchUrlSyncOptions {
  query: string;
  setQuery: (query: string) => void;
  debounceMs?: number;
  paramName?: string;
}

interface UseSearchUrlSyncReturn {
  handleQueryChange: (newQuery: string) => void;
}

/**
 * Hook optimizado para sincronizar el estado de búsqueda con la URL
 * - Inicializa la búsqueda desde el query param al cargar la página
 * - Actualiza la URL con debounce cuando cambia el query (400ms)
 * - Mantiene el input responsive sin lag usando memoización
 * - Previene re-renders innecesarios con useCallback
 */
export function useSearchUrlSync(options: UseSearchUrlSyncOptions): UseSearchUrlSyncReturn {
  const { query, setQuery, debounceMs = 400, paramName = "q" } = options;
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const isInitialMount = useRef(true);
  const urlUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Inicializar búsqueda desde URL solo al montar el componente
  useEffect(() => {
    if (isInitialMount.current) {
      const queryFromUrl = searchParams.get(paramName);
      if (queryFromUrl && queryFromUrl !== query) {
        setQuery(queryFromUrl);
      }
      isInitialMount.current = false;
    }
  }, [searchParams, paramName, query, setQuery]);

  // Actualizar URL con debounce cuando cambia el query
  useEffect(() => {
    // Skip en el primer render
    if (isInitialMount.current) return;

    // Limpiar timeout anterior si existe
    if (urlUpdateTimeoutRef.current) {
      clearTimeout(urlUpdateTimeoutRef.current);
    }

    // Programar actualización de URL con debounce
    urlUpdateTimeoutRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      const trimmedQuery = query.trim();
      
      if (trimmedQuery) {
        params.set(paramName, trimmedQuery);
      } else {
        params.delete(paramName);
      }
      
      const newUrl = trimmedQuery ? `?${params.toString()}` : window.location.pathname;
      router.replace(newUrl, { scroll: false });
    }, debounceMs);

    // Cleanup al desmontar o cuando cambie el query
    return () => {
      if (urlUpdateTimeoutRef.current) {
        clearTimeout(urlUpdateTimeoutRef.current);
      }
    };
  }, [query, debounceMs, searchParams, router, paramName]);

  // Handler memoizado para cambios en el input (respuesta inmediata)
  const handleQueryChange = useCallback((newQuery: string) => {
    setQuery(newQuery);
  }, [setQuery]);

  return useMemo(() => ({ handleQueryChange }), [handleQueryChange]);
}