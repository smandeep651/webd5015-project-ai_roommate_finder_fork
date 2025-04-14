import { NextResponse } from "next/server";
import { auth } from "@/lib/actions";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: {
        name: true,
        bio: true,
        image: true,
        email: true,
        matchesSent: { select: { id: true } },
        matchesReceived: { select: { id: true } },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
        name: user.name,
        bio: user.bio,
        image: user.image,
        email: user.email,
        matchesSentCount: user.matchesSent.length,
        matchesReceivedCount: user.matchesReceived.length,
    });

  } catch (error) {
    console.error("GET /api/users/basic error:", error);
    return NextResponse.json({ error: "Server error", details: error }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, bio, image } = body;

    const updatedUser = await db.user.update({
      where: { email: session.user.email },
      data: {
        name,
        bio,
        image,
        profileComplete: true,
      },
      select: {
        id: true,
        name: true,
        bio: true,
        image: true,
      },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("PUT /api/users/basic error:", error);
    return NextResponse.json({ error: "Server error", details: error }, { status: 500 });
  }
}
