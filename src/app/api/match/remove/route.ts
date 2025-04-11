// app/api/match/remove/route.ts
import { db } from "@/lib/db"; // make sure db is your Prisma client instance
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId, matchId } = await req.json();

    if (!userId || !matchId) {
      console.log("Missing fields:", { userId, matchId });
      return NextResponse.json(
        { error: "Missing userId or matchId" },
        { status: 400 }
      );
    }

    // Delete the match from either direction
    await db.match.deleteMany({
      where: {
        OR: [
          { userId, matchId },
          { userId: matchId, matchId: userId },
        ],
      },
    });
    

    return NextResponse.json(
      { message: "Match removed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error removing match:", error);
    return NextResponse.json(
      { error: "Failed to remove match" },
      { status: 500 }
    );
  }
}
