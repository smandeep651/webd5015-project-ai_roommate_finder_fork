import { auth } from "@/lib/actions";
import { fetchMatchedChats } from "@/lib/fetchMatchedChats";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const matches = await fetchMatchedChats(session.user.id);
  return NextResponse.json(matches);
}
