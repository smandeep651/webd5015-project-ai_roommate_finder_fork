import { PrismaClient } from "@prisma/client";
import Together from "together-ai";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const prisma = new PrismaClient();
const together = new Together({ apiKey: process.env.TOGETHER_API_KEY });

export async function findMatches(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { preferences: true },
  });

  if (!user || !user.preferences) {
    throw new Error("User or preferences not found");
  }

  const otherUsers = await prisma.user.findMany({
    where: { id: { not: userId } },
    include: { preferences: true },
  });

  // Strict match
  let matches = otherUsers.filter((u) => {
    const pref = u.preferences;
    const myPref = user.preferences;

    return (
      pref.location === myPref.location &&
      pref.budgetMin <= myPref.budgetMax &&
      pref.budgetMax >= myPref.budgetMin &&
      pref.occupation === myPref.occupation &&
      pref.smoking === myPref.smoking &&
      (myPref.genderPreference === "No Preference" || u.sex === myPref.genderPreference) &&
      (!myPref.religion || u.religion === myPref.religion) &&
      (!myPref.ethnicity || u.ethnicity === myPref.ethnicity) &&
      pref.ageMin <= myPref.ageMax &&
      pref.ageMax >= myPref.ageMin &&
      (pref.cooking === myPref.cooking || myPref.cooking === "Flexible")
    );
  });

  // Relaxed match
  if (matches.length === 0) {
    matches = otherUsers.filter((u) => {
      const pref = u.preferences;
      const myPref = user.preferences;

      return (
        pref.location === myPref.location &&
        pref.budgetMin <= myPref.budgetMax + 200 &&
        pref.budgetMax >= myPref.budgetMin - 200
      );
    }).slice(0, 5);
  }

  const matchNames = matches.map((m) => m.name).join(", ");
  const aiDescription = await getAiMatchDescription(user.preferences, matchNames);

  return { matches, aiDescription };
}

async function getAiMatchDescription(preferences: any, matchNames: string) {
  try {
    const response = await together.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `This is a roommate-matching system. The user is looking for matches with these preferences:
- Location: ${preferences.location}
- Budget: ${preferences.budgetMin} to ${preferences.budgetMax}
- Occupation: ${preferences.occupation}
- Smoking: ${preferences.smoking ? "Yes" : "No"}
- Drinking: ${preferences.drinking ? "Yes" : "No"}
- Cooking: ${preferences.cooking}

Based on the data, the following users are good matches: ${matchNames}. Reply with a professional and simple message like:
"Here are the possible matches for you."`,
        },
      ],
      model: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
    });

    return response.choices?.[0]?.message?.content || "Here are the possible matches for you.";
  } catch (error) {
    console.error("AI Matchmaking Error:", error);
    return "Here are the possible matches for you.";
  }
}
