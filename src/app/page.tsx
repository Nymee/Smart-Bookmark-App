import LoginButton from "@/components/LoginButton";
import Image from "next/image";

export default function Home() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black">
      {/* Background image */}
      <Image
        src="/book3.png"
        alt="Background"
        fill
        className="object-cover opacity-40"
        priority
      />

      {/* Dark overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/80" />

      {/* Animated accent orbs */}
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl animate-float" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl animate-float animation-delay-200" />
      <div className="absolute left-1/2 top-1/4 h-64 w-64 -translate-x-1/2 rounded-full bg-pink-500/10 blur-3xl animate-float animation-delay-400" />

      {/* Rotating ring decoration */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="h-[500px] w-[500px] rounded-full border border-white/5 animate-spin-slow" />
      </div>

      {/* Glass card */}
      <main className="relative z-10 mx-4 flex w-full max-w-md flex-col items-center gap-8 rounded-2xl border border-white/10 bg-white/5 px-8 py-12 shadow-2xl backdrop-blur-xl animate-fade-in-up animate-pulse-glow">
        {/* Bookmark icon */}
        <div className="flex items-center gap-3 opacity-0 animate-fade-in-up">
          <svg
            className="h-10 w-10 text-white/90"
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
          <span className="text-sm font-medium uppercase tracking-[0.3em] text-white/60">
            Bookmark
          </span>
        </div>

        {/* Title */}
        <div className="space-y-3 text-center opacity-0 animate-fade-in-up animation-delay-200">
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Welcome Back
          </h1>
          <p className="text-base leading-relaxed text-white/50">
            Save, organize &amp; rediscover your bookmarks — powered by AI.
          </p>
        </div>

        {/* Divider */}
        <div className="flex w-full items-center gap-4 opacity-0 animate-fade-in animation-delay-400">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>

        {/* Login button */}
        <div className="w-full opacity-0 animate-fade-in-up animation-delay-400">
          <LoginButton />
        </div>

        {/* Footer text */}
        <p className="text-xs text-white/30 opacity-0 animate-fade-in animation-delay-600">
          By continuing, you agree to our Terms &amp; Privacy Policy.
        </p>
      </main>
    </div>
  );
}
