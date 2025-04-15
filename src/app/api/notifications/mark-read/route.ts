import { auth } from "@/lib/actions";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { notificationId, senderId, type } = await req.json();

  if (!notificationId && !senderId) {
    return NextResponse.json(
      { error: "notificationId or senderId is required" },
      { status: 400 }
    );
  }

  try {
    
    if (senderId && type === "message") {
      await db.notification.deleteMany({
        where: {
          receiverId: session.user.id,
          senderId,
          type: "message",
        },
      });
    }
    
    if (notificationId) {
      await db.notification.delete({
        where: {
          id: notificationId,
        },
      });
    }

    console.log("🧪 Received mark-read request but skipping deletion to test real-time");


    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Failed to delete notification(s):", error);
    return NextResponse.json({ error: "Failed to delete notification(s)" }, { status: 500 });
  }
}
