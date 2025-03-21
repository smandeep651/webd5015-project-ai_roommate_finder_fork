import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

// Initialize Prisma client
const prisma = new PrismaClient();

// Zod schema for validating preferences
const updatePreferencesSchema = z.object({
  ethnicity: z.string().optional(),
  religion: z.string().optional(),
  minAge: z.number().optional(),
  maxAge: z.number().optional(),
  sex: z.string().optional(),
  genderPreference: z.string().optional(),
  occupation: z.string().optional(),
  preferredLocation: z.string().optional(),
  hasPets: z.boolean().optional(),
  petType: z.string().optional(),
  minBudget: z.number().optional(),
  maxBudget: z.number().optional(),
  accommodationType: z.string().optional(),
  sleepPattern: z.string().optional(),
  drinking: z.boolean().optional(),
  smoking: z.boolean().optional(),
  cooking: z.string().optional(),
});

// GET request - Fetch preferences by userId
export async function GET(req: Request, { params }: { params: { userId: string } }) {
  try {
    const preferences = await prisma.preferences.findUnique({
      where: { userId: params.userId }, // assuming userId is a string
    });
    if (!preferences) {
      return NextResponse.json({ error: "Preferences not found" }, { status: 404 });
    }
    return NextResponse.json(preferences);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch preferences" }, { status: 500 });
  }
}

// PUT request - Update preferences by userId
export async function PUT(req: Request, { params }: { params: { userId: string } }) {
  const body = await req.json();
  // Validate the incoming data using Zod schema
  const validation = updatePreferencesSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(validation.error.errors, { status: 400 });
  }

  try {
    const updatedPreferences = await prisma.preferences.update({
      where: { userId: params.userId },
      data: validation.data,
    });
    return NextResponse.json(updatedPreferences);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update preferences" }, { status: 500 });
  }
}
