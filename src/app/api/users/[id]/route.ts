import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

// Initialize Prisma client
const prisma = new PrismaClient();

// Zod schema for updating user details
const updateUserSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
});

// GET request - Fetch user details by id
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    // Correcting the user id lookup since it's a string
    const user = await prisma.user.findUnique({
      where: { id: params.id }, // 'id' is a string, no need to parse
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}

// PUT request - Update user details by id
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  // Validate the incoming data using Zod schema
  const validation = updateUserSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(validation.error.errors, { status: 400 });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: params.id }, // 'id' is a string, no need to parse
      data: validation.data,
    });
    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
