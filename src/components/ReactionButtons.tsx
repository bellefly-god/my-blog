"use client";

import { useState } from "react";

interface ReactionButtonsProps {
  slug: string;
  initialLikes: number;
  initialDislikes: number;
  initialUserReaction: "like" | "dislike" | null;
}

export function ReactionButtons({
  slug,
  initialLikes,
  initialDislikes,
  initialUserReaction,
}: ReactionButtonsProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [userReaction, setUserReaction] = useState<"like" | "dislike" | null>(
    initialUserReaction
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleReaction = async (reactionType: "like" | "dislike") => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/posts/${slug}/react`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reactionType }),
      });

      if (res.ok) {
        const data = await res.json();
        setLikes(data.likes);
        setDislikes(data.dislikes);
        setUserReaction(data.userReaction);
      }
    } catch (error) {
      console.error("Failed to submit reaction:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4 pt-6 border-t border-border mt-8">
      <span className="text-sm text-muted mr-2">Was this helpful?</span>
      <button
        onClick={() => handleReaction("like")}
        disabled={isLoading}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
          userReaction === "like"
            ? "bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/50"
            : "bg-card hover:bg-green-500/10 hover:text-green-600 dark:hover:text-green-400 border border-border hover:border-green-500/50"
        }`}
        aria-label="Like this post"
        aria-pressed={userReaction === "like"}
      >
        <span className="text-lg">👍</span>
        <span className="text-sm font-medium">{likes}</span>
      </button>
      <button
        onClick={() => handleReaction("dislike")}
        disabled={isLoading}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
          userReaction === "dislike"
            ? "bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/50"
            : "bg-card hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 border border-border hover:border-red-500/50"
        }`}
        aria-label="Dislike this post"
        aria-pressed={userReaction === "dislike"}
      >
        <span className="text-lg">👎</span>
        <span className="text-sm font-medium">{dislikes}</span>
      </button>
    </div>
  );
}
