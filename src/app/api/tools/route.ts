import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { DBTool } from "@/lib/types";

export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("tools")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data as DBTool[]);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch tools" },
      { status: 500 }
    );
  }
}
