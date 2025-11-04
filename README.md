# 🎵 Spori | Music Dashboard
<img width="1895" height="791" alt="image" src="https://github.com/user-attachments/assets/df57d6aa-c577-4f40-8403-dd6ad9d91433" />
<img width="1898" height="803" alt="image" src="https://github.com/user-attachments/assets/7be6122c-90c4-4c08-acb1-a0acf1763f57" />
<img width="1633" height="850" alt="image" src="https://github.com/user-attachments/assets/f598eb29-b281-43cd-a355-41324fdee0a5" />
<img width="1685" height="771" alt="image" src="https://github.com/user-attachments/assets/8a74e95d-696f-4beb-ba05-c11ecc14b910" />
<img width="1635" height="725" alt="image" src="https://github.com/user-attachments/assets/0b5d45c1-d711-4cec-b9a3-9816b7dfd65a" />
<img width="1612" height="667" alt="image" src="https://github.com/user-attachments/assets/de38761e-951f-40c9-b46f-5947ade82e56" />
<img width="1577" height="815" alt="image" src="https://github.com/user-attachments/assets/4cff30e3-fb45-4f4f-906f-78fbd0d11fac" />

## 💡 The Insight

Understand your listening habits at a glance. Spori surfaces your top artists and tracks, highlights your dominant genres, and visualizes audio features (energy, danceability, valence, tempo) to reveal your personal music “DNA.”

## ✨ Features

- **Authentication with Spotify**: Secure OAuth flow using Spotify's Web API.
- **Dashboard**:
  - **Overview**: Quick snapshot of your profile, top artists, and top tracks.
  - **Stats**: Charts for audio features and popularity trends.
- **Playlists**:
  - **Search**: Find playlists by name.
  - **DNA**: A perspective on your musical fingerprint.
  - **Yours**: Your personal playlists (requires authentication).
  - **Profile**: View playlist details, tracks, and audio analysis.
- **Artists**:
  - **Search**: Find artists and view metadata.
  - **Compare**: Compare multiple artists' popularity and audio traits.
  - **Profile**: View detailed artist information, top tracks, and albums.
- **Albums**:
  - **Search**: Find albums by name.
  - **Top**: Your most listened albums.
  - **Profile**: View album details, tracks, and audio features.
- **Tracks**:
  - **Search**: Find tracks by name.
  - **Top**: Your top tracks by time range.
  - **Profile**: Audio features breakdown per track with detailed analysis.
- **UX**: Dark mode, responsive layout, skeleton loaders/spinner, sidebar navigation, and caching for snappy feel.

## 🛠 Tech Stack (Why these?)

- **Next.js 16 (App Router)**: File-based routing and server actions for a clean API layer via `app/api/*` route handlers.
- **React 19**: Latest React features for optimal performance.
- **TypeScript**: Safer, more maintainable code with full type safety.
- **Shadcn UI + Radix UI**: Accessible, composable UI primitives for building consistent interfaces.
- **Tailwind CSS v4**: Utility-first CSS framework for rapid UI development.
- **Recharts**: Clean and responsive data visualizations.
- **Lucide React**: Beautiful, consistent icon system.
- **next-themes**: Seamless dark mode support.
- **Spotify Web API**: Complete access to user profile, top artists/tracks/albums, playlists, and audio features.
- **Next Route Handlers**: Encapsulate auth, token refresh, and API calls in one secure place.

## 📦 Project Structure

- **`app/`**: All application routes and pages
  - `app/api/spotify/*`: Secure server-side API endpoints for authentication and data fetching
  - `app/dashboard/*`: Dashboard pages (overview, stats)
  - `app/profile/*`: User profile page
  - `app/artists/*`: Artist-related pages (search, compare, individual profiles)
  - `app/albums/*`: Album-related pages (search, top, individual profiles)
  - `app/tracks/*`: Track-related pages (search, top, individual profiles)
  - `app/playlists/*`: Playlist-related pages (search, DNA, yours, individual profiles)
  - `app/insights/*`: Insights pages (facts, genres, trends)
- **`lib/`**: Core utilities and helpers
  - `spotify.ts`: Spotify API client, token management, and data utilities
  - `cache.ts`: Client-side caching mechanisms
  - `api-helpers.ts`: API utility functions
  - `utils.ts`: General utility functions
- **`hooks/`**: Custom React hooks for data fetching and state management
  - Session and authentication hooks
  - Data fetching hooks for artists, albums, tracks, playlists
  - Search and profile hooks
  - Mobile detection and responsive behavior
- **`components/`**: Reusable UI components
  - `ui/*`: Base UI primitives from Shadcn/Radix
  - `page-skeletons/*`: Loading states for different pages
  - Layout components (sidebar, header, breadcrumb)
  - Feature-specific cards and visualizations
  - Search and navigation components
- **`contexts/`**: React context providers
  - `spotify-session-context.tsx`: Global session state management

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

## 🔐 Authentication Flow

The app uses Spotify's OAuth 2.0 flow with secure token management:

1. **Login**: User clicks login → redirects to `GET /api/spotify/login`
2. **Authorization**: Spotify prompts user to authorize the app
3. **Callback**: Spotify redirects to `GET /api/spotify/callback` with authorization code
4. **Token Exchange**: Server exchanges code for access/refresh tokens
5. **Secure Storage**: Tokens stored in HTTP-only cookies (never exposed to client)
6. **Session**: `GET /api/spotify/session` checks authentication status
7. **Refresh**: `POST /api/spotify/refresh` automatically renews expired tokens
8. **Logout**: `GET /api/spotify/logout` clears all cookies and session data

All sensitive operations happen server-side for maximum security.

## 🧭 API Endpoints

### Authentication
- `GET /api/spotify/login` - Initiates Spotify OAuth flow
- `GET /api/spotify/callback` - Handles OAuth callback and token exchange
- `POST /api/spotify/refresh` - Refreshes expired access tokens
- `GET /api/spotify/session` - Returns current session status and user info
- `GET /api/spotify/logout` - Clears session and logs out

### User Data
- `GET /api/spotify/top-artists` - Fetches user's top artists
- `GET /api/spotify/top-tracks` - Fetches user's top tracks
- `GET /api/spotify/top-albums` - Fetches user's top albums
- `GET /api/spotify/user-playlists` - Fetches user's playlists

### Search
- `GET /api/spotify/search-artists` - Search for artists
- `GET /api/spotify/search-albums` - Search for albums
- `GET /api/spotify/search-tracks` - Search for tracks
- `GET /api/spotify/search-playlists` - Search for playlists

### Detailed Information
- `GET /api/spotify/artist/[id]` - Get artist details
- `GET /api/spotify/artist/[id]/top-tracks` - Get artist's top tracks
- `GET /api/spotify/artist/[id]/albums` - Get artist's albums
- `GET /api/spotify/album/[id]` - Get album details
- `GET /api/spotify/album/[id]/tracks` - Get album's tracks
- `GET /api/spotify/track/[id]` - Get track details
- `GET /api/spotify/playlist/[id]` - Get playlist details
- `GET /api/spotify/playlist/[id]/tracks` - Get playlist's tracks
- `GET /api/spotify/audio-features` - Get audio features for tracks

All endpoints wrap Spotify Web API calls via server-side fetches defined in `lib/spotify.ts`.

## 🗺️ Available Routes

### Main Pages
- `/` - Landing page with login prompt
- `/profile` - Your Spotify profile page

### Dashboard
- `/dashboard` - Main dashboard (redirects to overview)
- `/dashboard/overview` - Overview of your listening habits
- `/dashboard/stats` - Detailed statistics and charts

### Insights
- `/insights` - Insights hub (redirects to facts)
- `/insights/facts` - Quick facts about your music taste
- `/insights/genres` - Genre distribution and analysis
- `/insights/trends` - Trends over time and release years

### Artists
- `/artists` - Artists hub (redirects to search)
- `/artists/search` - Search for artists
- `/artists/compare` - Compare multiple artists
- `/artists/[id]` - Individual artist profile

### Albums
- `/albums` - Albums hub (redirects to search)
- `/albums/search` - Search for albums
- `/albums/top` - Your top albums
- `/albums/[id]` - Individual album profile

### Tracks
- `/tracks` - Tracks hub (redirects to search)
- `/tracks/search` - Search for tracks
- `/tracks/top` - Your top tracks
- `/tracks/[id]` - Individual track profile with audio features

### Playlists
- `/playlists` - Playlists hub (redirects to search)
- `/playlists/search` - Search for playlists
- `/playlists/dna` - Your musical DNA analysis
- `/playlists/yours` - Your personal playlists
- `/playlists/[id]` - Individual playlist profile

## 🧪 Scripts

```
npm run dev    # starts Next.js bound to 127.0.0.1
npm run build  # builds for production
npm run start  # serves the production build bound to 127.0.0.1
```

## ✅ Notes

- If you see auth issues, re-check the Redirect URI and that you’re opening `http://127.0.0.1:3000`.
- Token refresh is handled transparently; if it fails, you may be logged out.
- This project aims for clean, accessible UI with a responsive layout and dark mode.
