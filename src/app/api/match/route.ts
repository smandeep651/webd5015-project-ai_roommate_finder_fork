import { NextResponse } from "next/server";
import { auth } from "@/lib/actions";
import { findMatches } from "@/lib/aiMatcher";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ matches: [], aiDescription: "Unauthorized" }, { status: 401 });
  }

  const { matches, aiDescription } = await findMatches(session.user.id);

  return NextResponse.json({ matches, aiDescription });
}
