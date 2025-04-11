import { auth } from "@/lib/actions";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    console.log("💬 Incoming message body:", body);

    const { senderId, receiverId, message } = body;

    if (!senderId || !receiverId || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const savedMessage = await db.message.create({
      data: {
        senderId: new ObjectId(senderId).toString(),
        receiverId: new ObjectId(receiverId).toString(),
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

    return NextResponse.json({ success: true, message: savedMessage });
  } catch (error) {
    console.error("❌ Failed to save message:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
