import { auth } from "@/lib/actions";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { user1, user2 } = await req.json();

  if (!user1 || !user2) {
    return NextResponse.json({ error: "Missing user IDs" }, { status: 400 });
  }

  const messages = await db.message.findMany({
    where: {
      OR: [
        { senderId: user1, receiverId: user2 },
        { senderId: user2, receiverId: user1 },
      ],
    },
    orderBy: { timestamp: "asc" },
  });

  return NextResponse.json({ success: true, messages });
}
