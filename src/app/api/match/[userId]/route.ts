import { NextResponse } from "next/server";
import { findMatches } from "@/lib/aiMatcher";

export async function GET(req: Request) {
  // Extract userId from URL
  const segments = req.url.split("/");
  const userId = segments[segments.length - 1];

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const result = await findMatches(userId);
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("AI Match error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Try again later." },
      { status: 500 }
    );
  }
}
