"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Bookmark } from "@/types/bookmark";
import BookmarkCard from "@/components/BookmarkCard";
import AddBookmark from "@/components/AddBookmark";
import GlassCard from "@/components/ui/GlassCard";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const PAGE_SIZE = 10;

export default function BookmarkList() {
  const supabase = createClient();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const knownIds = useRef(new Set<string>());

  const fetchBookmarks = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (data) {
      setBookmarks(data);
      knownIds.current = new Set(data.map((b) => b.id));
    }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchBookmarks();

    const channel = supabase
      .channel("bookmarks-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "bookmarks" },
        (payload) => {
          const newBookmark = payload.new as Bookmark;
          if (knownIds.current.has(newBookmark.id)) return;
          knownIds.current.add(newBookmark.id);
          setBookmarks((prev) => [newBookmark, ...prev]);
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "bookmarks" },
        (payload) => {
          const deletedId = payload.old.id as string;
          knownIds.current.delete(deletedId);
          setBookmarks((prev) => prev.filter((b) => b.id !== deletedId));
        }
      )
      .subscribe();

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        fetchBookmarks();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      supabase.removeChannel(channel);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAdd = useCallback((bookmark: Bookmark) => {
    knownIds.current.add(bookmark.id);
    setBookmarks((prev) => [bookmark, ...prev]);
    setPage(1);
  }, []);

  const handleDelete = useCallback((id: string) => {
    knownIds.current.delete(id);
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return bookmarks;
    const q = search.toLowerCase();
    return bookmarks.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.url.toLowerCase().includes(q)
    );
  }, [bookmarks, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  return (
    <div className="flex flex-col gap-4">
      {/* Add form */}
      <GlassCard size="md" className="animate-fade-in-up">
        <AddBookmark onAdd={handleAdd} />
      </GlassCard>

      {/* Search */}
      {!loading && bookmarks.length > 0 && (
        <div className="animate-fade-in-up animation-delay-200">
          <Input
            placeholder="Search bookmarks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            inputSize="md"
          />
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-amber-400/20 border-t-amber-400/60" />
        </div>
      ) : bookmarks.length === 0 ? (
        <GlassCard size="md" className="animate-fade-in-up animation-delay-200">
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <svg
              className="h-10 w-10 text-foreground/12"
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
            <p className="text-sm text-foreground/25">
              No bookmarks yet. Add your first one above!
            </p>
          </div>
        </GlassCard>
      ) : filtered.length === 0 ? (
        <div className="py-6 text-center text-sm text-foreground/25">
          No bookmarks match &ldquo;{search}&rdquo;
        </div>
      ) : (
        <>
          <div className="grid gap-3">
            {paginated.map((bookmark) => (
              <BookmarkCard key={bookmark.id} bookmark={bookmark} onDelete={handleDelete} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <span className="text-sm text-foreground/25">
                {filtered.length} bookmark{filtered.length !== 1 ? "s" : ""}
                {search && " found"}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Prev
                </Button>
                <span className="text-sm text-foreground/35">
                  {page} / {totalPages}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
