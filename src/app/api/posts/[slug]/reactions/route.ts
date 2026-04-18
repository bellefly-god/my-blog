import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const supabase = await createClient();

    // Try to get the post from database
    const { data: post } = await supabase
      .from("posts")
      .select("id, likes, dislikes")
      .eq("slug", slug)
      .single();

    // Get client IP and hash it
    const clientIP = getClientIP(request);
    const ipHash = await hashIP(clientIP);

    let likes = 0;
    let dislikes = 0;
    let userReaction: "like" | "dislike" | null = null;

    if (post) {
      likes = post.likes;
      dislikes = post.dislikes;

      // Check user's reaction
      const { data: reaction } = await supabase
        .from("reactions")
        .select("reaction_type")
        .eq("post_id", post.id)
        .eq("ip_hash", ipHash)
        .single();

      userReaction = reaction?.reaction_type || null;
    }

    return NextResponse.json({
      likes,
      dislikes,
      userReaction,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch reactions" },
      { status: 500 }
    );
  }
}
