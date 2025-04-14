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

export async function PATCH(req: Request, { params }: { params: { userId: string } }) {
  try {
    const body = await req.json();

    // The error indicated that 'id' is an unknown argument.
    // Ensure that 'userId' is used and the body keys match the actual preferences model.

    // Prepare the data to be updated
    const updateData: Record<string, any> = {};

    // Map the fields that are acceptable based on the model schema
    if (body.ethnicity) updateData.ethnicity = body.ethnicity;
    if (body.religion) updateData.religion = body.religion;
    if (body.minAge) updateData.minAge = body.minAge;
    if (body.maxAge) updateData.maxAge = body.maxAge;
    if (body.genderPreference) updateData.genderPreference = body.genderPreference;
    if (body.occupation) updateData.occupation = body.occupation;
    if (body.preferredLocation) updateData.preferredLocation = body.preferredLocation;
    if (body.hasPets !== undefined) updateData.hasPets = body.hasPets;
    if (body.petType) updateData.petType = body.petType;
    if (body.minBudget) updateData.minBudget = body.minBudget;
    if (body.maxBudget) updateData.maxBudget = body.maxBudget;
    if (body.accommodationType) updateData.accommodationType = body.accommodationType;
    if (body.sleepPattern) updateData.sleepPattern = body.sleepPattern;
    if (body.drinking !== undefined) updateData.drinking = body.drinking;
    if (body.smoking !== undefined) updateData.smoking = body.smoking;
    if (body.cooking) updateData.cooking = body.cooking;

    // Update preferences using the 'userId' in the URL params
    const updatedPreferences = await prisma.preferences.update({
      where: { userId: params.userId },
      data: updateData,
    });

    return NextResponse.json(updatedPreferences, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error', details: error }, { status: 500 });
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
