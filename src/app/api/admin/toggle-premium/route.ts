import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.formData();
  const userId = formData.get("userId") as string;

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user || user.role === "Admin") {
    return NextResponse.json({ error: "Invalid user" }, { status: 400 });
  }

  await db.user.update({
    where: { id: userId },
    data: { isPremium: !user.isPremium },
  });

  return NextResponse.redirect("/admin/users");
}
