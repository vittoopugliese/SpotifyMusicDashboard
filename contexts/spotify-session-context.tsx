"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type SpotifySession = {
  authenticated: boolean;
  id?: string;
  email?: string;
  profile?: unknown;
};

type SpotifySessionContextValue = {
  session: SpotifySession;
  loading: boolean;
  login: () => void;
  refresh: () => Promise<void>;
};

const SpotifySessionContext = createContext<SpotifySessionContextValue | null>(null);

export function SpotifySessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<SpotifySession>({ authenticated: false });
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/spotify/session", { cache: "no-store" });
      const json = (await res.json()) as SpotifySession;
      setSession(json);
    } catch {
      setSession({ authenticated: false });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await refresh();
      if (cancelled) return;
    })();
    return () => { cancelled = true; };
  }, [refresh]);

  const login = useCallback(() => {
    const origin = window.location.origin || "http://127.0.0.1:3000";
    window.location.href = `${origin}/api/spotify/login`;
  }, []);

  const value = useMemo(
    () => ({ session, loading, login, refresh }),
    [session, loading, login, refresh]
  );

  return (
    <SpotifySessionContext.Provider value={value}>{children}</SpotifySessionContext.Provider>
  );
}

export function useSpotifySession() {
  const ctx = useContext(SpotifySessionContext);
  if (!ctx) throw new Error("useSpotifySession must be used within a SpotifySessionProvider");
  return ctx;
}


