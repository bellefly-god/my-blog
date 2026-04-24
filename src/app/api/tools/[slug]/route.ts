import { NextResponse } from "next/server";
import { getToolBySlug } from "@/lib/d1";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const tool = await getToolBySlug(slug);

    if (!tool) {
      return NextResponse.json({ error: "Tool not found" }, { status: 404 });
    }

    return NextResponse.json(tool);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch tool" },
      { status: 500 }
    );
  }
}
