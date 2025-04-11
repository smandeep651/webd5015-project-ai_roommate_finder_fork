"use server";

import { auth } from "@/lib/actions";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { startOfDay, endOfDay } from "date-fns";

export async function sendMatchRequest({
  matchId,
  message,
}: {
  matchId: string;
  message: string;
}) {
  const session = await auth();

  if (!session?.user?.id || !matchId) {
    const error: any = new Error("Unauthorized or missing data");
    error.status = 401;
    throw error;
  }

  const userId = session.user.id;

  const existing = await db.match.findFirst({
    where: { userId, matchId },
  });

  if (existing) {
    const error: any = new Error("Request already sent");
    error.status = 400;
    throw error;
  }

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
      const error: any = new Error("You've reached your daily request limit. Upgrade to premium.");
      error.status = 403;
      throw error;
    }
  }

  await db.match.create({
    data: {
      userId,
      matchId,
      message,
      status: "pending",
    },
  });

  // optional: also save the message if you want
  if (message && message.trim()) {
    await db.message.create({
      data: {
        senderId: userId,
        receiverId: matchId,
        message,
        timestamp: new Date(),
      },
    });
  }

  revalidatePath("/home");

  return { success: true };
}
