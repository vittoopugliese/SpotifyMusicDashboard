"use client";

import { useEffect, useState } from "react";

export type SpotifySession = {
  authenticated: boolean;
  profile?: { display_name?: string; images?: Array<{ url: string }>; id?: string; email?: string };
};

export function useSpotifyToken() {
  const [session, setSession] = useState<SpotifySession>({ authenticated: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch("/api/spotify/session", { cache: "no-store" });
        const json = (await res.json()) as SpotifySession;
        if (!cancelled) setSession(json);
      } catch {
        if (!cancelled) setSession({ authenticated: false });
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = () => {
    window.location.href = "/api/spotify/login";
  };

  return { session, loading, login };
}

