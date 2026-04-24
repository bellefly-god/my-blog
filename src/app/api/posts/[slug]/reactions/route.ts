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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Get the post from D1
    const post = await getPostBySlug(slug);

    let likes = 0;
    let dislikes = 0;
    let userReaction: "like" | "dislike" | null = null;

    if (post) {
      likes = post.likes || 0;
      dislikes = post.dislikes || 0;

      // Get client IP and hash it
      const clientIP = getClientIP(request);
      const ipHash = await hashIP(clientIP);

      // Check user's reaction
      const reactions = await executeQuery(
        "SELECT reaction_type FROM reactions WHERE post_id = ? AND ip_hash = ?",
        [post.id, ipHash]
      ) as { reaction_type: string }[];

      userReaction = reactions.length > 0 ? reactions[0].reaction_type as "like" | "dislike" : null;
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
