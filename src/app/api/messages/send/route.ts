import { auth } from "@/lib/actions";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { createNotification } from "@/lib/notifications";

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    console.log("💬 Incoming message body:", body);

    const { senderId, receiverId, message } = body;

    if (!senderId || !receiverId || !message?.trim()) {
      return NextResponse.json(
        { error: "Missing or invalid message fields" },
        { status: 400 }
      );
    }

    const savedMessage = await db.message.create({
      data: {
        senderId,
        receiverId,
        message,
        status: "sent",
      },
      select: {
        id: true,
        senderId: true,
        receiverId: true,
        message: true,
        timestamp: true,
        status: true,
      },
    });

    // 🔔 Optional: create notification for new message
    const sender = await db.user.findUnique({
      where: { id: senderId },
      select: { name: true },
    });

    await createNotification({
      type: "message",
      message: `${sender?.name || "Someone"} sent you a message.`,
      senderId,
      receiverId,
    });

    return NextResponse.json({ success: true, message: savedMessage });
  } catch (error) {
    console.error("❌ Failed to save message:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
