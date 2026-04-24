import { NextRequest, NextResponse } from "next/server";
import { executeQuery, getPostBySlug } from "@/lib/d1";

// Helper to hash IP for privacy
async function hashIP(ip: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(ip + "blog-reaction-salt");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Get client IP from request
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  return "unknown";
}

interface PostRecord {
  id: string;
  likes: number;
  dislikes: number;
}

// Get or create post in D1 database
async function getOrCreatePost(slug: string): Promise<PostRecord | null> {
  // Try to get existing post
  const existing = await executeQuery(
    "SELECT id, likes, dislikes FROM posts WHERE slug = ?",
    [slug]
  ) as PostRecord[];

  if (existing.length > 0) {
    return existing[0];
  }

  // Post doesn't exist in D1, try to find by slug variants
  const post = await getPostBySlug(slug);
  if (!post) {
    return null;
  }

  return {
    id: post.id,
    likes: post.likes || 0,
    dislikes: post.dislikes || 0,
  };
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { reactionType } = body;

    if (!["like", "dislike"].includes(reactionType)) {
      return NextResponse.json(
        { error: "Invalid reaction type" },
        { status: 400 }
      );
    }

    // Get or create the post
    const post = await getOrCreatePost(slug);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Get client IP and hash it
    const clientIP = getClientIP(request);
    const ipHash = await hashIP(clientIP);

    // Check if user already reacted
    const existingReactions = await executeQuery(
      "SELECT id, reaction_type FROM reactions WHERE post_id = ? AND ip_hash = ?",
      [post.id, ipHash]
    ) as { id: string; reaction_type: string }[];

    const existingReaction = existingReactions[0];

    if (existingReaction) {
      // If same reaction, remove it (toggle off)
      if (existingReaction.reaction_type === reactionType) {
        await executeQuery("DELETE FROM reactions WHERE id = ?", [existingReaction.id]);

        const updateField = reactionType === "like" ? "likes" : "dislikes";
        await executeQuery(
          `UPDATE posts SET ${updateField} = MAX(0, ${updateField} - 1) WHERE id = ?`,
          [post.id]
        );

        const updated = await executeQuery(
          "SELECT likes, dislikes FROM posts WHERE id = ?",
          [post.id]
        ) as { likes: number; dislikes: number }[];

        return NextResponse.json({
          success: true,
          action: "removed",
          likes: updated[0]?.likes ?? 0,
          dislikes: updated[0]?.dislikes ?? 0,
          userReaction: null,
        });
      }

      // Different reaction - update existing one
      const oldField = existingReaction.reaction_type === "like" ? "likes" : "dislikes";
      const newField = reactionType === "like" ? "likes" : "dislikes";

      await executeQuery(
        "UPDATE reactions SET reaction_type = ? WHERE id = ?",
        [reactionType, existingReaction.id]
      );

      await executeQuery(
        `UPDATE posts SET ${oldField} = MAX(0, ${oldField} - 1), ${newField} = ${newField} + 1 WHERE id = ?`,
        [post.id]
      );

      const updated = await executeQuery(
        "SELECT likes, dislikes FROM posts WHERE id = ?",
        [post.id]
      ) as { likes: number; dislikes: number }[];

      return NextResponse.json({
        success: true,
        action: "updated",
        likes: updated[0]?.likes ?? 0,
        dislikes: updated[0]?.dislikes ?? 0,
        userReaction: reactionType,
      });
    }

    // New reaction
    const reactionId = crypto.randomUUID();
    await executeQuery(
      "INSERT INTO reactions (id, post_id, reaction_type, ip_hash, created_at) VALUES (?, ?, ?, ?, datetime('now'))",
      [reactionId, post.id, reactionType, ipHash]
    );

    const updateField = reactionType === "like" ? "likes" : "dislikes";
    await executeQuery(
      `UPDATE posts SET ${updateField} = ${updateField} + 1 WHERE id = ?`,
      [post.id]
    );

    const updated = await executeQuery(
      "SELECT likes, dislikes FROM posts WHERE id = ?",
      [post.id]
    ) as { likes: number; dislikes: number }[];

    return NextResponse.json({
      success: true,
      action: "added",
      likes: updated[0]?.likes ?? 0,
      dislikes: updated[0]?.dislikes ?? 0,
      userReaction: reactionType,
    });
  } catch (error) {
    console.error("Reaction error:", error);
    return NextResponse.json(
      { error: "Failed to process reaction" },
      { status: 500 }
    );
  }
}
