import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { DBPost, DBReaction } from "@/lib/types";

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

    // Get the post
    const { data: post, error: postError } = await supabase
      .from("posts")
      .select("*")
      .eq("slug", slug)
      .single();

    if (postError || !post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Get user's reaction if IP is available
    const clientIP = getClientIP(request);
    const ipHash = await hashIP(clientIP);

    const { data: reaction } = await supabase
      .from("reactions")
      .select("reaction_type")
      .eq("post_id", post.id)
      .eq("ip_hash", ipHash)
      .single();

    const response = {
      ...(post as DBPost),
      userReaction: reaction ? (reaction as DBReaction).reaction_type : null,
    };

    return NextResponse.json(response);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}
