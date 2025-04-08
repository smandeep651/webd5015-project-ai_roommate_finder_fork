import { NextResponse } from "next/server";
import { auth } from "@/lib/actions"; 
import { db } from "@/lib/db"; 

export async function PUT(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const {
      profileImageUrl,
      name,
      bio,
      age,
      sex,
      occupation,
      preferredLocation,
      ethnicity,
      religion,
      ageRange,
      genderPreference,
      accommodationType,
      budget,
      pets,
      habits,
      cooking,
    } = body;

    const updatedUser = await db.user.update({
      where: { email: session.user.email },
      data: {
        image: profileImageUrl,
        name,
        bio,
        profileComplete: true,
        preferences: {
          upsert: {
            create: {
              preferredLocation,
              ethnicity,
              religion,
              minAge: ageRange.min,
              maxAge: ageRange.max,
              sex,
              genderPreference,
              occupation,
              hasPets: pets.hasPets,
              petType: pets.type,
              minBudget: budget.min,
              maxBudget: budget.max,
              accommodationType,
              sleepPattern: habits.sleepPattern,
              drinking: habits.drinking,
              smoking: habits.smoking,
              cooking,
            },
            update: {
              preferredLocation,
              ethnicity,
              religion,
              minAge: ageRange.min,
              maxAge: ageRange.max,
              sex,
              genderPreference,
              occupation,
              hasPets: pets.hasPets,
              petType: pets.type,
              minBudget: budget.min,
              maxBudget: budget.max,
              accommodationType,
              sleepPattern: habits.sleepPattern,
              drinking: habits.drinking,
              smoking: habits.smoking,
              cooking,
            },
          },
        },
      },
    });

    return NextResponse.json(updatedUser, { status: 200 });

  } catch (error) {
    console.error("PUT /api/users/me error:", error);
    return NextResponse.json({ error: "Server error", details: error }, { status: 500 });
  }
}
