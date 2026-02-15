# Smart Bookmark Manager

A modern, real-time bookmark manager built with **Next.js 16**, **Supabase**, and **Tailwind CSS 4**. Features Google OAuth authentication, per-user private bookmarks with Row Level Security, real-time sync across browser tabs, and a dark glassmorphism UI.

**Live URL:** _[will be added after Vercel deployment]_

---

## Features

- **Google OAuth** sign-in (no email/password needed)
- **Add bookmarks** with URL + title
- **Delete bookmarks** with instant UI feedback
- **Private bookmarks** — each user only sees their own (enforced at the database level via RLS)
- **Real-time sync** — add or delete a bookmark in one tab, it appears/disappears in all other tabs instantly (no refresh)
- **Search** — filter bookmarks by title or URL
- **Pagination** — 10 bookmarks per page
- **Dark theme** with glassmorphism (black + gold aesthetic)
- **Reusable UI components** — `Button`, `Input`, `GlassCard` with parameterized variants and sizes

---

## Tech Stack

| Layer       | Technology                              |
| ----------- | --------------------------------------- |
| Framework   | Next.js 16 (App Router, React 19)      |
| Auth        | Supabase Auth (Google OAuth)            |
| Database    | Supabase PostgreSQL                     |
| Real-time   | Supabase Realtime (postgres_changes)    |
| Styling     | Tailwind CSS 4                          |
| Language    | TypeScript                              |
| Deployment  | Vercel                                  |

---

## Project Structure

```
src/
├── app/
│   ├── auth/
│   │   ├── callback/route.ts       # Google OAuth callback handler
│   │   └── signout/route.ts        # Sign-out server action
│   ├── dashboard/page.tsx           # Main dashboard (server component)
│   ├── globals.css                  # Theme variables, animations
│   ├── layout.tsx                   # Root layout
│   └── page.tsx                     # Landing / sign-in page
├── components/
│   ├── AddBookmark.tsx              # Add bookmark form
│   ├── BookmarkCard.tsx             # Single bookmark display + delete
│   ├── BookmarkList.tsx             # List orchestrator (realtime, search, pagination)
│   ├── LoginButton.tsx              # Google OAuth trigger
│   ├── SignOutButton.tsx            # Sign-out button
│   └── ui/
│       ├── Button.tsx               # Reusable button (glass/solid/ghost/danger × sm/md/lg)
│       ├── Input.tsx                # Reusable input (sm/md/lg, label, error states)
│       ├── GlassCard.tsx            # Reusable glass card (sm/md/lg, hover effect)
│       └── index.ts                 # Barrel export
├── lib/supabase/
│   ├── client.ts                    # Browser-side Supabase client
│   ├── server.ts                    # Server-side Supabase client (cookies)
│   └── middleware.ts                # Auth-aware route protection logic
├── types/
│   └── bookmark.ts                  # Bookmark TypeScript interface
└── middleware.ts                    # Next.js middleware (calls supabase middleware)

supabase/
└── schema.sql                       # Database schema, RLS policies, realtime config
```

---

## Supabase Concepts Explained

### What is Supabase?

Supabase is an open-source Firebase alternative. It gives you a **PostgreSQL database**, **authentication**, **real-time subscriptions**, and **storage** — all accessible via a JavaScript client library. You don't need to write a backend API; Supabase exposes your database directly to the frontend while using **Row Level Security** to keep data safe.

### Row Level Security (RLS)

RLS is a PostgreSQL feature that controls **which rows** a user can read, insert, update, or delete. Without RLS, anyone with your Supabase anon key could read the entire `bookmarks` table. With RLS enabled:

```sql
-- Only let users see their own bookmarks
CREATE POLICY "Users can view own bookmarks"
  ON bookmarks FOR SELECT
  USING (auth.uid() = user_id);

-- Only let users insert bookmarks as themselves
CREATE POLICY "Users can insert own bookmarks"
  ON bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Only let users delete their own bookmarks
CREATE POLICY "Users can delete own bookmarks"
  ON bookmarks FOR DELETE
  USING (auth.uid() = user_id);
```

`auth.uid()` is a built-in Supabase function that returns the currently authenticated user's ID. The database itself enforces that User A can never see or touch User B's bookmarks — even if someone tampers with the frontend code. This is what makes RLS so powerful: **security lives at the database layer**, not in your application code.

### Supabase Realtime

Supabase Realtime uses PostgreSQL's built-in replication to broadcast row changes (INSERT, UPDATE, DELETE) to subscribed clients over WebSockets. In this project, when a bookmark is added or deleted in one tab, every other tab subscribed to the `bookmarks` table receives the change instantly.

### Anon Key vs Service Role Key

- **Anon key** (`NEXT_PUBLIC_SUPABASE_ANON_KEY`): Safe to expose in the browser. It only has the permissions granted by your RLS policies.
- **Service role key**: Bypasses all RLS. Never expose this in the frontend. We don't use it in this project.

There is no `DATABASE_URL` needed — the Supabase JS client talks to your database via Supabase's REST API using the project URL + anon key.

---

## Google OAuth Setup (Step by Step)

Setting up Google sign-in requires configuring both **Google Cloud Console** and **Supabase**. Here's the full process:

### 1. Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/) and create a new project (or use an existing one).
2. Navigate to **APIs & Services → OAuth consent screen**.
   - Choose **External** user type.
   - Fill in the app name, support email, and developer email.
   - Add the scope: `openid`, `email`, `profile`.
   - Add your email as a test user (while the app is in "Testing" mode, only test users can sign in).
3. Navigate to **APIs & Services → Credentials**.
   - Click **Create Credentials → OAuth 2.0 Client ID**.
   - Application type: **Web application**.
   - Add authorized redirect URI: `https://<your-supabase-project>.supabase.co/auth/v1/callback`
   - Copy the **Client ID** and **Client Secret**.

> **Note on 2-Factor Authentication:** Google requires that the Google account owning the Cloud project has 2-Step Verification enabled before you can create OAuth credentials. If you haven't enabled it: go to your Google Account → Security → 2-Step Verification → turn it on. This is a Google account security requirement, not a Supabase one.

### 2. Supabase Dashboard

1. Go to your Supabase project → **Authentication → Providers → Google**.
2. Toggle Google to **Enabled**.
3. Paste the **Client ID** and **Client Secret** from Google Cloud Console.
4. Save. Supabase will automatically handle the OAuth flow, token exchange, and session management.

### 3. Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...your-anon-key
```

You get these from Supabase Dashboard → **Settings → API**.

---

## Database Setup

Run the SQL in `supabase/schema.sql` in the **Supabase SQL Editor** (Dashboard → SQL Editor → New Query → paste → Run):

```sql
-- Creates the bookmarks table
CREATE TABLE bookmarks (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  url        TEXT NOT NULL,
  title      TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- RLS policies (select, insert, delete for own rows only)
-- ... see supabase/schema.sql for full details

-- Required for real-time DELETE payloads
ALTER TABLE bookmarks REPLICA IDENTITY FULL;

-- Enable realtime broadcasting
ALTER PUBLICATION supabase_realtime ADD TABLE bookmarks;
```

---

## Getting Started (Local Development)

### Prerequisites

- Node.js 18+
- npm
- A Supabase project (free tier works)

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/<your-username>/Smart-Bookmark-App.git
cd Smart-Bookmark-App

# 2. Install dependencies
npm install

# 3. Create env file and fill in your Supabase credentials
cp .env.local.example .env.local

# 4. Run the database schema in Supabase SQL Editor (see supabase/schema.sql)

# 5. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and sign in with Google.

---

## Problems Encountered & Solutions

### 1. Real-Time Updates Not Working Across Tabs

**Problem:** The core assignment requirement was that adding a bookmark in one tab should instantly appear in another tab — without refreshing. After setting up Supabase Realtime subscriptions, INSERTs were being broadcast but DELETE events had empty payloads, so the other tab couldn't know which bookmark was removed.

**Investigation:** Supabase Realtime uses PostgreSQL's logical replication. By default, DELETE events only include the primary key of the deleted row. But depending on RLS policies and how you process the payload, the `old` record can come through empty.

**Solution:** Added `REPLICA IDENTITY FULL` to the bookmarks table:

```sql
ALTER TABLE bookmarks REPLICA IDENTITY FULL;
```

This tells PostgreSQL to include the **entire old row** in the replication stream on DELETE, not just the primary key. After this change, `payload.old.id` was populated and cross-tab deletions worked.

**Extra safety net:** Added a `visibilitychange` listener that refetches bookmarks when a hidden tab becomes visible again. This handles edge cases like the browser throttling WebSocket connections for background tabs:

```ts
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") fetchBookmarks();
});
```

### 2. Duplicate Bookmarks After Adding (Optimistic + Real-Time Race)

**Problem:** When adding a bookmark, it appeared **twice** in the list. The optimistic UI update added it immediately, and then the Supabase Realtime subscription also received the INSERT event and added it again.

**Solution:** Maintained a `knownIds` ref (a `Set<string>`) that tracks all bookmark IDs currently in state. The real-time handler checks this set before adding:

```ts
const knownIds = useRef(new Set<string>());

// In the realtime handler:
if (knownIds.current.has(newBookmark.id)) return; // skip duplicate
knownIds.current.add(newBookmark.id);
setBookmarks((prev) => [newBookmark, ...prev]);
```

### 3. Delete Hanging Until Tab Switch

**Problem:** Clicking "Delete" on a bookmark would fire the Supabase delete call, but the bookmark wouldn't disappear from the UI until switching to another tab and back.

**Root cause:** The component was relying solely on the Realtime subscription to remove the bookmark from state. But since the subscription and the delete call happen asynchronously, the UI felt stuck.

**Solution:** Added an `onDelete` callback that optimistically removes the bookmark from state immediately after a successful delete, without waiting for the Realtime event:

```ts
const handleDelete = async () => {
  const { error } = await supabase.from("bookmarks").delete().eq("id", bookmark.id);
  if (!error) onDelete(bookmark.id); // remove from UI immediately
};
```

### 4. Bookmarks Not Appearing After Insert

**Problem:** After successfully inserting a bookmark, the list didn't update. The insert call returned no data, so the optimistic `onAdd` callback had nothing to work with.

**Solution:** Chained `.select().single()` to the insert query to get the created row back:

```ts
const { data } = await supabase
  .from("bookmarks")
  .insert({ url, title, user_id: user.id })
  .select()   // ← tells Supabase to return the inserted row
  .single();   // ← unwraps the array into a single object
```

### 5. Hydration Mismatch Warning in Development

**Problem:** The browser console showed a hydration mismatch error pointing to `layout.tsx`. The server-rendered HTML didn't match what the client rendered.

**Investigation:** The error showed an unexpected `style` attribute (`--vsc-domain: "localhost"`) on the `<html>` tag. This was not present in our code.

**Root cause:** The **VSCode browser preview extension** injects a `style` attribute into the `<html>` element at runtime. Since the server-rendered HTML doesn't have this attribute but the client does (after the extension injects it), React flags a hydration mismatch.

**Solution:** This is a development environment artifact — not a code bug. It does not occur in production or when opening the app in a regular browser. No code change was needed.

### 6. `create-next-app` Rejecting Capital Letters

**Problem:** `create-next-app` rejected the directory name `Smart-Bookmark-App` because npm doesn't allow capital letters in package names.

**Solution:** Created the project in a temp directory with a lowercase name, then copied the generated files into the correctly named repo.

---

## Design Decisions

- **Reusable components with variants:** `Button`, `Input`, and `GlassCard` each accept `size` and `variant` props, making them consistent across the entire app while being flexible.
- **Client-side search and pagination:** With a typical bookmark collection being under a few hundred items, client-side filtering is simpler and more responsive than making a new database query on every keystroke.
- **Optimistic updates + Realtime:** Same-tab actions feel instant (optimistic), while cross-tab sync is handled by Supabase Realtime. The `knownIds` ref prevents duplicates between the two.
- **Server components where possible:** The dashboard page is a server component that fetches the user session server-side and redirects if unauthenticated, keeping auth logic out of the client bundle.

---

## Deployment

Deployed on **Vercel**. The live URL will be added once deployment is complete.

When deploying, make sure to:
1. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to Vercel's environment variables.
2. Add your Vercel deployment URL to Google Cloud Console's authorized redirect URIs:
   `https://<your-app>.vercel.app/auth/callback`
3. Also add it to Supabase Dashboard → Authentication → URL Configuration → Redirect URLs.
