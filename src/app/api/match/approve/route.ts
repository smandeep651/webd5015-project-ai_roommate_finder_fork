import { auth } from "@/lib/actions";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

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

  return NextResponse.json({ success: true });
}
