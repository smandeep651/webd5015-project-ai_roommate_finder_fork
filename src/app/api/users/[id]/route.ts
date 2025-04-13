import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      include: { preferences: true },
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Server error", details: error }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: body,
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Server error", details: error }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.user.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "User deleted" }, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: "Server error", details: error }, { status: 500 });
  }
}
