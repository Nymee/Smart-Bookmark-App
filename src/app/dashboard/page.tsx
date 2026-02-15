import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SignOutButton from "@/components/SignOutButton";
import BookmarkList from "@/components/BookmarkList";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const firstName = user.user_metadata?.full_name?.split(" ")[0] ?? "there";

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Glass navbar */}
      <header className="sticky top-0 z-50 border-b border-amber-200/[0.05] bg-surface/50 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-muted">
              <svg
                className="h-5 w-5 text-accent"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
                />
              </svg>
            </div>
            <span className="text-base font-semibold text-foreground/70">
              Smart Bookmark Manager
            </span>
          </div>

          <div className="flex items-center gap-3">
            {user.user_metadata?.avatar_url && (
              <img
                src={user.user_metadata.avatar_url}
                alt={user.user_metadata.full_name ?? "Avatar"}
                className="h-9 w-9 rounded-full border border-amber-200/[0.08]"
              />
            )}
            <SignOutButton />
          </div>
        </div>
      </header>

      {/* Main content — flex-1 to fill remaining viewport */}
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 py-8">
        <div className="mb-6 animate-fade-in-up">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Hey, {firstName}
          </h1>
          <p className="mt-2 text-base text-foreground/30">
            Your saved bookmarks appear here.
          </p>
        </div>

        <BookmarkList />
      </main>
    </div>
  );
}
