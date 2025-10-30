"use client";

import { useState, useEffect } from "react";

// For development: you can set a token in localStorage with key 'spotify_user_token'
// In production, this would come from OAuth flow
export function useSpotifyToken() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Check localStorage for development token
    const storedToken = typeof window !== "undefined" 
      ? localStorage.getItem("spotify_user_token") 
      : null;
    
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  return token;
}

