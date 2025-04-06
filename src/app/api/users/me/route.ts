import { NextResponse } from "next/server";
import { auth } from "../../../../../actions/auth"; 
import { db } from "@/lib/db"; 

export async function PUT(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Update user based on session email
    const updatedUser = await db.user.update({
      where: { email: session.user.email },
      data: {
        ...body,
        profileComplete: true,
      },
    });

    return NextResponse.json(updatedUser, { status: 200 });

  } catch (error) {
    console.error("PUT /api/users/me error:", error);
    return NextResponse.json({ error: "Server error", details: error }, { status: 500 });
  }
}
