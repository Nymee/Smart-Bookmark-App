export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <main className="flex flex-col items-center gap-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          Smart Bookmark App
        </h1>
        <p className="max-w-md text-lg text-zinc-600 dark:text-zinc-400">
          Save and organize your bookmarks with real-time sync across devices.
        </p>
      </main>
    </div>
  );
}
