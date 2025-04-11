// src/app/api/matches/delete/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // Assuming db is Prisma or another database client

export async function POST(req: Request) {
  try {
    const { matchId } = await req.json();

    if (!matchId) {
      return NextResponse.json({ error: "Missing matchId" }, { status: 400 });
    }

    // 1. Delete the match
    await db.match.deleteMany({
      where: {
        OR: [
          { id: matchId },                    // match entry by ID
          { matchId: matchId },               // other side
          { userId: matchId }                 // just in case
        ]
      }
    });

    // 2. Delete messages between both users
    await db.message.deleteMany({
      where: {
        OR: [
          { senderId: matchId },
          { receiverId: matchId }
        ]
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Error deleting match:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
