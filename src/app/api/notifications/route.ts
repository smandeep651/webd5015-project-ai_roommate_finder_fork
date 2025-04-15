import { auth } from "@/lib/actions";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const notifications = await db.notification.findMany({
    where: {
      receiverId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
include: {
  sender: {
    select: {
      name: true,
      image: true, // ✅ include this!
    },
  },
},
  });

  console.log("📬 Notifications for", session.user.id, notifications);

  return NextResponse.json(notifications);
}
