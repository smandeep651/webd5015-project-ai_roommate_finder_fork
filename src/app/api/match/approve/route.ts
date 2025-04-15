import { auth } from "@/lib/actions";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { createNotification } from "@/lib/notifications";


export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const requestId = formData.get("requestId") as string;

  if (!requestId) {
    return NextResponse.json({ error: "Request ID is required" }, { status: 400 });
  }

  // Update the match request status to "accepted"
  await db.match.update({
    where: { id: requestId },
    data: { status: "accepted" },
  });

  try {
    const receiver = await db.user.findUnique({ where: { id: match.matchId } }); // the approver
    const sender = await db.user.findUnique({ where: { id: match.userId } }); // the requester

    if (receiver && sender) {
      await createNotification({
        type: "request-approved",
        message: `${receiver.name} accepted your match request.`,
        senderId: receiver.id,
        receiverId: sender.id,
      });
    }
  } catch (error) {
    console.error("❌ Failed to create approval notification:", error);
  }


  return NextResponse.json({ success: true });
}
