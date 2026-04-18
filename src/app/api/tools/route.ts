import { NextResponse } from "next/server";
import { getAllTools } from "@/lib/d1";

export async function GET() {
  try {
    const tools = await getAllTools();
    return NextResponse.json(tools);
  } catch (error) {
    console.error("Failed to fetch tools:", error);
    return NextResponse.json(
      { error: "Failed to fetch tools" },
      { status: 500 }
    );
  }
}
