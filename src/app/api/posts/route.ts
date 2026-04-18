import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { DBPost } from "@/lib/types";

export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data as DBPost[]);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
