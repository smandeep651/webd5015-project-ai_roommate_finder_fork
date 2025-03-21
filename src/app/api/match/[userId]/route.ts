import { NextResponse } from "next/server";
import { findMatches } from "@/lib/aiMatcher"; // ✅ updated import path

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  const userId = params.userId;

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
