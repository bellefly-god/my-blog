import { NextResponse } from "next/server";
import { D1Post, executeQuery } from "@/lib/d1";

export async function GET() {
  try {
    // Check if D1 is configured
    if (!process.env.CLOUDFLARE_API_TOKEN) {
      return NextResponse.json(
        { error: "D1 not configured" },
        { status: 500 }
      );
    }

    const posts = await executeQuery(
      "SELECT * FROM posts ORDER BY date DESC"
    ) as D1Post[];

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Failed to fetch posts from D1:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
