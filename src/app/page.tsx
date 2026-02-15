import LoginButton from "@/components/LoginButton";
import Image from "next/image";

export default function Home() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
      {/* Background image */}
      <Image
        src="/book3.png"
        alt="Background"
        fill
        className="object-cover opacity-25"
        priority
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/60 to-amber-950/20" />

      {/* Animated accent orbs */}
      <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-amber-600/10 blur-[100px] animate-float" />
      <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-orange-600/8 blur-[100px] animate-float animation-delay-200" />
      <div className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-yellow-500/5 blur-[80px] animate-float animation-delay-400" />

      {/* Rotating ring */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="h-[480px] w-[480px] rounded-full border border-amber-400/[0.04] animate-spin-slow" />
      </div>

      {/* Glass card */}
      <main className="relative z-10 mx-4 flex w-full max-w-md flex-col items-center gap-6 rounded-2xl border border-amber-200/[0.06] bg-surface/70 px-8 py-10 shadow-2xl shadow-amber-500/[0.03] backdrop-blur-2xl animate-fade-in-up animate-pulse-glow">
        {/* Bookmark icon */}
        <div className="flex items-center gap-2.5 opacity-0 animate-fade-in-up">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-muted">
            <svg
              className="h-4 w-4 text-accent"
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
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-foreground/35">
            Smart Bookmark Manager
          </span>
        </div>

        {/* Title */}
        <div className="space-y-2 text-center opacity-0 animate-fade-in-up animation-delay-200">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Welcome
          </h1>
          <p className="text-sm leading-relaxed text-foreground/35">
            Save &amp; rediscover your bookmarks with real-time sync.
          </p>
        </div>

        {/* Divider */}
        <div className="flex w-full items-center opacity-0 animate-fade-in animation-delay-400">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-400/10 to-transparent" />
        </div>

        {/* Login button */}
        <div className="w-full opacity-0 animate-fade-in-up animation-delay-400">
          <LoginButton />
        </div>

        {/* Footer text */}
        <p className="text-[10px] text-foreground/20 opacity-0 animate-fade-in animation-delay-600">
          By continuing, you agree to our Terms &amp; Privacy Policy.
        </p>
      </main>
    </div>
  );
}
