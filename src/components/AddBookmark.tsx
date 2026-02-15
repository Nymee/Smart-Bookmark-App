"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Bookmark } from "@/types/bookmark";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface AddBookmarkProps {
  onAdd: (bookmark: Bookmark) => void;
}

export default function AddBookmark({ onAdd }: AddBookmarkProps) {
  const supabase = createClient();
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedUrl = url.trim();
    const trimmedTitle = title.trim();

    if (!trimmedUrl || !trimmedTitle) {
      setError("Both fields are required.");
      return;
    }

    try {
      new URL(trimmedUrl);
    } catch {
      setError("Please enter a valid URL (e.g. https://example.com).");
      return;
    }

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("You must be signed in.");
      setLoading(false);
      return;
    }

    const { data, error: insertError } = await supabase
      .from("bookmarks")
      .insert({ url: trimmedUrl, title: trimmedTitle, user_id: user.id })
      .select()
      .single();

    if (insertError) {
      setError(insertError.message);
    } else if (data) {
      onAdd(data);
      setUrl("");
      setTitle("");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <Input
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            inputSize="md"
            type="url"
          />
        </div>
        <div className="flex-1">
          <Input
            placeholder="Bookmark title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            inputSize="md"
          />
        </div>
        <Button
          type="submit"
          variant="solid"
          size="md"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add"}
        </Button>
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </form>
  );
}
