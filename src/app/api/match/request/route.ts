import { auth } from "@/lib/actions";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { startOfDay, endOfDay } from "date-fns";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const { matchId, message } = await req.json();

  if (!matchId) {
    return NextResponse.json({ error: "Match ID is required" }, { status: 400 });
  }

  // Check if already sent
  const existing = await db.match.findFirst({
    where: {
      userId,
      matchId,
    },
  });

  if (existing) {
    return NextResponse.json({ error: "Request already sent" }, { status: 400 });
  }

  // Check premium status
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { isPremium: true },
  });

  if (!user?.isPremium) {
    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());

    const requestsToday = await db.match.count({
      where: {
        userId,
        createdAt: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    });

    if (requestsToday >= 3) {
      return NextResponse.json({
        error: "You've reached your daily request limit. Upgrade to premium to send more.",
      }, { status: 403 });
    }
  }

  // Create match
  const match = await db.match.create({
    data: {
      userId,
      matchId,
      message,
      status: "pending",
    },
  });

  // Optional: Save the message
  try {
    if (message && message.trim().length > 0) {
      await db.message.create({
        data: {
          senderId: userId,
          receiverId: matchId,
          message,
          timestamp: new Date(),
        },
      });
    }
  } catch (error) {
    console.error("❌ Failed to save message:", error);
  }

  return NextResponse.json({ success: true, match });
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const requests = await db.match.findMany({
    where: {
      matchId: session.user.id,
      status: "pending",
    },
    include: {
      sender: {
        include: {
          preferences: true,
        },
      },
    },
  });

  return NextResponse.json({ requests });
}
