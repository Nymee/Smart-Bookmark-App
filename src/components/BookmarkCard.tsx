"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Bookmark } from "@/types/bookmark";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";

interface BookmarkCardProps {
  bookmark: Bookmark;
}

export default function BookmarkCard({ bookmark }: BookmarkCardProps) {
  const supabase = createClient();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    await supabase.from("bookmarks").delete().eq("id", bookmark.id);
    // Real-time subscription will handle removal from the list
  };

  let displayUrl: string;
  try {
    displayUrl = new URL(bookmark.url).hostname.replace("www.", "");
  } catch {
    displayUrl = bookmark.url;
  }

  return (
    <GlassCard size="sm" hover className="animate-fade-in-up">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block truncate text-sm font-medium text-white transition-colors hover:text-white/80"
          >
            {bookmark.title}
          </a>
          <p className="mt-1 truncate text-xs text-white/30">
            {displayUrl}
          </p>
        </div>

        <Button
          variant="danger"
          size="sm"
          onClick={handleDelete}
          disabled={deleting}
          icon={
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              />
            </svg>
          }
        >
          {deleting ? "..." : "Delete"}
        </Button>
      </div>
    </GlassCard>
  );
}
