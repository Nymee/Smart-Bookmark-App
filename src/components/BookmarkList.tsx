"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Bookmark } from "@/types/bookmark";
import BookmarkCard from "@/components/BookmarkCard";
import AddBookmark from "@/components/AddBookmark";
import GlassCard from "@/components/ui/GlassCard";

export default function BookmarkList() {
  const supabase = createClient();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch initial bookmarks
    const fetchBookmarks = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from("bookmarks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (data) setBookmarks(data);
      setLoading(false);
    };

    fetchBookmarks();

    // Subscribe to real-time changes
    const channel = supabase
      .channel("bookmarks-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "bookmarks" },
        (payload) => {
          setBookmarks((prev) => [payload.new as Bookmark, ...prev]);
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "bookmarks" },
        (payload) => {
          setBookmarks((prev) =>
            prev.filter((b) => b.id !== payload.old.id)
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return (
    <div className="flex flex-col gap-6">
      {/* Add form */}
      <GlassCard size="md" className="animate-fade-in-up">
        <AddBookmark />
      </GlassCard>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white/60" />
        </div>
      ) : bookmarks.length === 0 ? (
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
                d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
              />
            </svg>
            <p className="text-sm text-white/30">
              No bookmarks yet. Add your first one above!
            </p>
          </div>
        </GlassCard>
      ) : (
        <div className="grid gap-3">
          {bookmarks.map((bookmark) => (
            <BookmarkCard key={bookmark.id} bookmark={bookmark} />
          ))}
        </div>
      )}
    </div>
  );
}
