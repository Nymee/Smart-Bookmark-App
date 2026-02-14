import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SignOutButton from "@/components/SignOutButton";
import GlassCard from "@/components/ui/GlassCard";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const firstName = user.user_metadata?.full_name?.split(" ")[0] ?? "there";

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-black/60 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <svg
              className="h-6 w-6 text-white/80"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
              />
            </svg>
            <span className="text-sm font-semibold text-white/90">
              Bookmarks
            </span>
          </div>

          <div className="flex items-center gap-4">
            {user.user_metadata?.avatar_url && (
              <img
                src={user.user_metadata.avatar_url}
                alt={user.user_metadata.full_name ?? "Avatar"}
                className="h-8 w-8 rounded-full border border-white/10"
              />
            )}
            <SignOutButton />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-5xl px-6 py-10">
        {/* Welcome section */}
        <div className="mb-10 animate-fade-in-up">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Hey, {firstName}
          </h1>
          <p className="mt-2 text-white/40">
            Your saved bookmarks appear here. Add one to get started.
          </p>
        </div>

        {/* Bookmark form + list placeholder — will be built in next branch */}
        <GlassCard size="lg" className="animate-fade-in-up animation-delay-200">
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <svg
              className="h-12 w-12 text-white/20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            <p className="text-sm text-white/30">
              No bookmarks yet. Add your first one!
            </p>
          </div>
        </GlassCard>
      </main>
    </div>
  );
}
