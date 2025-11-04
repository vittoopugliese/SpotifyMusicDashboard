# 🎵 Spori | Music Dashboard
<img width="1895" height="791" alt="image" src="https://github.com/user-attachments/assets/df57d6aa-c577-4f40-8403-dd6ad9d91433" />
<img width="1898" height="803" alt="image" src="https://github.com/user-attachments/assets/7be6122c-90c4-4c08-acb1-a0acf1763f57" />
<img width="1633" height="850" alt="image" src="https://github.com/user-attachments/assets/f598eb29-b281-43cd-a355-41324fdee0a5" />
<img width="1685" height="771" alt="image" src="https://github.com/user-attachments/assets/8a74e95d-696f-4beb-ba05-c11ecc14b910" />
<img width="1635" height="725" alt="image" src="https://github.com/user-attachments/assets/0b5d45c1-d711-4cec-b9a3-9816b7dfd65a" />
<img width="1612" height="667" alt="image" src="https://github.com/user-attachments/assets/de38761e-951f-40c9-b46f-5947ade82e56" />
<img width="1577" height="815" alt="image" src="https://github.com/user-attachments/assets/4cff30e3-fb45-4f4f-906f-78fbd0d11fac" />

## 💡 The Insight

Understand your listening habits at a glance. This dashboard surfaces your top artists and tracks, highlights your dominant genres, and visualizes audio features (energy, danceability, valence, tempo) to reveal your personal music “DNA.”

## ✨ Features

- **Authentication with Spotify**: Secure OAuth flow using Spotify’s Web API.
- **Dashboard Overview**: Quick snapshot of your profile, top artists, and top tracks.
- **Stats**: Charts for audio features and popularity trends.
- **Insights**:
  - **Facts**: Quick-hit takeaways about your listening patterns.
  - **Genres**: Dominant genres and distribution.
  - **Trends**: Release years and changing preferences over time.
- **Artists**:
  - **Search**: Find artists and view metadata.
  - **Compare**: Compare artists’ popularity and audio traits.
- **Tracks**:
  - **Top**: Your top tracks by time range.
  - **Analysis**: Audio features breakdown per track.
- **Playlists**:
  - **DNA**: A perspective on your musical fingerprint.
  - **Yours**: Your playlists (with user token).
- **UX**: Dark mode, responsive layout, skeleton loaders/spinner, and caching for snappy feel.

## 🛠 Tech Stack (Why these?)

- **Next.js (App Router)**: File-based routing and server actions for a clean API layer via `app/api/*` route handlers.
- **TypeScript**: Safer, more maintainable code.
- **Shadcn UI + Radix**: Accessible, composable UI primitives.
- **Recharts**: Clean data visualizations.
- **Spotify Web API**: User profile, top artists/tracks, and audio features.
- **Next Route Handlers**: Encapsulate auth, token refresh, and API calls in one place.

## 📦 Project Highlights

- `lib/spotify.ts`: Spotify API helpers, token management, and utilities (grouping, averages, year parsing).
- `app/api/spotify/*`: Secure server-side endpoints for login, callback, refresh, session, and data fetches.
- `hooks/*`: Client hooks for token, data, and mobile behavior.
- `components/*`: Composable UI and layout building blocks.

## ⚠️ Important: Do NOT use localhost

For Spotify OAuth redirects, use `http://127.0.0.1:3000` instead of `http://localhost:3000`.

- The dev server is already bound to `127.0.0.1` via package scripts.
- Configure Spotify Redirect URI using `127.0.0.1` (see Quick Start below).

## 🚀 Quick Start

1) **Clone and install**
```
git clone https://github.com/vittoopugliese/SpotifyMusicDashboard
cd spotify-music-dashboard
npm install
```

2) **Create a Spotify App**
- Go to the Spotify Developer Dashboard and create an application.
- Set the Redirect URI to:
```
http://127.0.0.1:3000/api/spotify/callback
```
Note: Do not use `localhost` for the Redirect URI.

3) **Environment variables**
Create a `.env.local` file in the project root:
```
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
```

4) **Run the app**
```
npm run dev
```
Open:
```
http://127.0.0.1:3000
```

5) **Log in with Spotify**
- Use the “Log in” action in the app.
- After consent, you’ll be redirected to the dashboard with your data.

## 🔐 Auth & Tokens

- `GET /api/spotify/login`: Starts OAuth with a CSRF-protected state cookie.
- `GET /api/spotify/callback`: Exchanges code for access/refresh tokens and stores them in HTTP-only cookies.
- `POST /api/spotify/refresh`: Refreshes the access token when needed.
- `GET /api/spotify/session`: Returns `authenticated` and lightweight profile info.
- `GET /api/spotify/logout`: Clears cookies and redirects back to the dashboard.

## 🧭 Notable Data Endpoints

- `GET /api/spotify/top-artists`
- `GET /api/spotify/top-tracks`

These wrap Spotify endpoints via server-side fetches defined in `lib/spotify.ts`.

## 🧪 Scripts

```
npm run dev    # starts Next.js bound to 127.0.0.1
npm run build  # builds for production
npm run start  # serves the production build bound to 127.0.0.1
```

## 📁 Minimal File Map

- `app/` – Routes (pages and API route handlers)
- `components/` – Reusable UI and layout
- `hooks/` – Client hooks
- `lib/` – Spotify helpers, caching, and utils

## ✅ Notes

- If you see auth issues, re-check the Redirect URI and that you’re opening `http://127.0.0.1:3000`.
- Token refresh is handled transparently; if it fails, you may be logged out.
- This project aims for clean, accessible UI with a responsive layout and dark mode.
