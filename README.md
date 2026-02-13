# Smart Bookmark App

A smart bookmark manager with real-time updates, built with Next.js, Supabase, and Tailwind CSS.

## Features

- Google OAuth sign-in (no email/password)
- Add bookmarks (URL + title)
- Private bookmarks per user
- Real-time sync across tabs/devices
- Delete bookmarks

## Tech Stack

- **Next.js 15** (App Router)
- **Supabase** (Auth, Database, Realtime)
- **Tailwind CSS** for styling
- **TypeScript**

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- A Supabase project

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/<your-username>/Smart-Bookmark-App.git
   cd Smart-Bookmark-App
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file from the example:
   ```bash
   cp .env.local.example .env.local
   ```

4. Fill in your Supabase credentials in `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL` — Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Your Supabase anonymous key

5. **Supabase Setup:**
   - Enable Google OAuth in Supabase Dashboard → Authentication → Providers → Google
   - Create a `bookmarks` table (schema will be provided in later branches)

6. Run the development server:
   ```bash
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts        # OAuth callback handler
│   ├── globals.css
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Home page
├── components/                  # Reusable UI components (TBD)
├── lib/
│   └── supabase/
│       ├── client.ts           # Browser Supabase client
│       ├── middleware.ts       # Session refresh middleware
│       └── server.ts           # Server Supabase client
└── middleware.ts               # Next.js middleware for auth
```

## Problems Encountered & Solutions

### 1. Project naming with `create-next-app`
**Problem:** `create-next-app` rejected the directory name `Smart-Bookmark-App` because npm doesn't allow capital letters in package names.
**Solution:** Created the project in a temp directory with a lowercase name, then copied the generated files into the repo.

## Deployment

Deployed on Vercel — live URL will be added once deployment is complete.
