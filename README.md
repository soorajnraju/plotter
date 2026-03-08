# Plotter

A full-stack incident tracking web app. Plot, search, and manage incidents on an interactive map — built with Next.js, Leaflet/OpenStreetMap, Supabase, and Tailwind CSS.

## Features

- **Interactive map** — click anywhere to report an incident; markers are colored by severity
- **Incident management** — create, update status, and delete incidents you own
- **Search & filter** — filter by keyword, category, severity, and status
- **Incidents list** — card grid view with "View on map" deep-link that auto-pans and opens the popup
- **Focus location** — locate and center the map on your current position
- **Authentication** — email/password sign-in and Google OAuth via Supabase
- **Dark mode** — system-aware theme with manual toggle (light / dark / system)
- **Cookie consent** — GDPR-friendly cookie banner with localStorage persistence
- **Analytics** — Vercel Analytics for page-view and interaction tracking
- **Legal pages** — Privacy Policy and Terms of Service pages
- **Free tier** — OpenStreetMap tiles (no API key), Supabase free tier, Vercel hobby deployment

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript) |
| Map | Leaflet.js + react-leaflet + OpenStreetMap |
| Auth & DB | Supabase (PostgreSQL + Row Level Security) |
| Styling | Tailwind CSS v4 |
| Theming | next-themes |
| Analytics | Vercel Analytics |
| Deployment | Vercel |

## Getting Started

### 1. Clone and install

```bash
git clone <your-repo-url>
cd plotter
npm install
```

### 2. Set up Supabase

1. Create a free project at [supabase.com](https://supabase.com)
2. Run the schema in the Supabase SQL Editor:

```sql
-- contents of supabase/schema.sql
```

Or copy-paste the file `supabase/schema.sql` directly into the SQL Editor.

3. (Optional) Enable Google OAuth: **Supabase Dashboard → Authentication → Providers → Google**, then add your Google OAuth credentials.

### 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Both values are found in **Supabase Dashboard → Project Settings → API**.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── (auth)/login/          # Login page (email + Google OAuth)
│   ├── (dashboard)/
│   │   ├── map/               # Map page (reads ?lat=&lng= for deep-link)
│   │   └── incidents/         # Incidents list page
│   ├── (legal)/
│   │   ├── privacy/           # Privacy Policy page
│   │   └── terms/             # Terms of Service page
│   ├── api/incidents/         # REST API (GET, POST, PATCH, DELETE)
│   └── auth/callback/         # OAuth callback handler
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx         # Top navigation bar
│   │   ├── CookieBanner.tsx   # GDPR cookie consent banner
│   │   ├── ThemeProvider.tsx  # next-themes wrapper
│   │   └── ThemeSwitcher.tsx  # Light / dark / system toggle
│   ├── map/
│   │   ├── MapView.tsx        # Client state wrapper
│   │   ├── LeafletMap.tsx     # Leaflet instance (SSR-disabled)
│   │   └── AddIncidentModal.tsx
│   └── incidents/
│       ├── IncidentListView.tsx
│       ├── IncidentCard.tsx
│       └── SearchFilter.tsx
├── lib/
│   ├── supabase/              # Supabase client & server helpers
│   └── utils.ts               # Color maps, category icons, cn()
├── types/incident.ts
└── proxy.ts                   # Auth middleware (Next.js 16)
supabase/schema.sql            # Database schema + RLS policies
```

## API Reference

All REST endpoints are documented in [API.md](API.md). This includes full request/response shapes for:

- **Auth** — `POST /api/auth/signup`, `POST /api/auth/login`, `POST /api/auth/logout`, `POST /api/auth/refresh`, `GET /api/auth/me`
- **Incidents** — `GET`, `POST`, `GET /:id`, `PATCH /:id`, `DELETE /:id`

All endpoints support **Bearer token auth** (`Authorization: Bearer <access_token>`) for mobile clients, in addition to the cookie-based session used by the web app.

## Deployment (Vercel)

1. Push your code to GitHub / GitLab
2. Import the repo in [Vercel](https://vercel.com/new)
3. Add environment variables in **Vercel → Project → Settings → Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy — Vercel auto-detects Next.js and handles everything else

## Incident Categories

`Infrastructure` · `Crime` · `Fire` · `Medical` · `Weather` · `Traffic` · `Other`

## Severity Levels

| Severity | Marker Color |
|---|---|
| Low | Green |
| Medium | Yellow |
| High | Orange |
| Critical | Red |
