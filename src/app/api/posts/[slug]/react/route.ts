import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getPostBySlug } from "@/lib/posts";

// Helper to hash IP for privacy
async function hashIP(ip: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(ip + process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
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

// Get or create post in database
async function getOrCreatePost(supabase: Awaited<ReturnType<typeof createClient>>, slug: string) {
  // Try to get existing post
  const { data: existingPost, error } = await supabase
    .from("posts")
    .select("id, likes, dislikes")
    .eq("slug", slug)
    .single();

  if (existingPost) {
    return existingPost;
  }

  // Post doesn't exist, try to create from MDX
  // Use default locale 'en' for API routes
  const mdxPost = getPostBySlug(slug, "en");
  if (!mdxPost) {
    return null;
  }

  // Create the post in database
  const { data: newPost, error: createError } = await supabase
    .from("posts")
    .insert({
      title: mdxPost.title,
      slug: mdxPost.slug,
      excerpt: mdxPost.excerpt,
      date: mdxPost.date,
      likes: 0,
      dislikes: 0,
    })
    .select("id, likes, dislikes")
    .single();

  return newPost || null;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const supabase = await createClient();

    // Get the reaction type from request body
    const body = await request.json();
    const { reactionType } = body;

    if (!["like", "dislike"].includes(reactionType)) {
      return NextResponse.json(
        { error: "Invalid reaction type" },
        { status: 400 }
      );
    }

    // Get or create the post
    const post = await getOrCreatePost(supabase, slug);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Get client IP and hash it
    const clientIP = getClientIP(request);
    const ipHash = await hashIP(clientIP);

    // Check if user already reacted
    const { data: existingReaction } = await supabase
      .from("reactions")
      .select("id, reaction_type")
      .eq("post_id", post.id)
      .eq("ip_hash", ipHash)
      .single();

    if (existingReaction) {
      // If same reaction, remove it (toggle off)
      if (existingReaction.reaction_type === reactionType) {
        // Delete the reaction
        await supabase.from("reactions").delete().eq("id", existingReaction.id);

        // Decrement the counter
        const updateField = reactionType === "like" ? "likes" : "dislikes";
        await supabase
          .from("posts")
          .update({ [updateField]: Math.max(0, post[updateField] - 1) })
          .eq("id", post.id);

        // Get updated post
        const { data: updatedPost } = await supabase
          .from("posts")
          .select("likes, dislikes")
          .eq("id", post.id)
          .single();

        return NextResponse.json({
          success: true,
          action: "removed",
          likes: updatedPost?.likes ?? 0,
          dislikes: updatedPost?.dislikes ?? 0,
          userReaction: null,
        });
      }

      // Different reaction - update existing one
      const oldReactionType = existingReaction.reaction_type;
      const oldField = oldReactionType === "like" ? "likes" : "dislikes";
      const newField = reactionType === "like" ? "likes" : "dislikes";

      // Update reaction type
      await supabase
        .from("reactions")
        .update({ reaction_type: reactionType })
        .eq("id", existingReaction.id);

      // Update counters
      await supabase
        .from("posts")
        .update({
          [oldField]: Math.max(0, post[oldField] - 1),
          [newField]: post[newField] + 1,
        })
        .eq("id", post.id);

      // Get updated post
      const { data: updatedPost } = await supabase
        .from("posts")
        .select("likes, dislikes")
        .eq("id", post.id)
        .single();

      return NextResponse.json({
        success: true,
        action: "updated",
        likes: updatedPost?.likes ?? 0,
        dislikes: updatedPost?.dislikes ?? 0,
        userReaction: reactionType,
      });
    }

    // New reaction
    await supabase.from("reactions").insert({
      post_id: post.id,
      reaction_type: reactionType,
      ip_hash: ipHash,
    });

    // Increment the counter
    const updateField = reactionType === "like" ? "likes" : "dislikes";
    await supabase
      .from("posts")
      .update({ [updateField]: post[updateField] + 1 })
      .eq("id", post.id);

    // Get updated post
    const { data: updatedPost } = await supabase
      .from("posts")
      .select("likes, dislikes")
      .eq("id", post.id)
      .single();

    return NextResponse.json({
      success: true,
      action: "added",
      likes: updatedPost?.likes ?? 0,
      dislikes: updatedPost?.dislikes ?? 0,
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
