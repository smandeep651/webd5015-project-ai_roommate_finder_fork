import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: { userId: string } }) {
  try {
    const preferences = await prisma.preferences.findUnique({
      where: { userId: params.userId },
    });

    if (!preferences) return NextResponse.json({ error: "Preferences not found" }, { status: 404 });

    return NextResponse.json(preferences, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Server error", details: error }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { userId: string } }) {
  try {
    const body = await req.json();
    const updatedPreferences = await prisma.preferences.upsert({
      where: { userId: params.userId },
      update: body,
      create: { userId: params.userId, ...body },
    });

    return NextResponse.json(updatedPreferences, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Server error", details: error }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { userId: string } }) {
  try {
    await prisma.preferences.delete({ where: { userId: params.userId } });
    return NextResponse.json({ message: "Preferences deleted" }, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: "Server error", details: error }, { status: 500 });
  }
}
