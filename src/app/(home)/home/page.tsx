
import { auth } from "@/lib/actions";
import { findMatches } from "@/lib/aiMatcher";
import Image from "next/image";
import { Button } from "@/components/ui-elements/button";
import { LikeIcon, MessageOutlineIcon, RemoveIcon } from "@/assets/icons";
import Link from "next/link";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import MatchCard from "../_components/MatchCard";
import { sendMatchRequest } from "@/actions/sendMatchRequest";
import { redirect } from "next/navigation";


export default async function HomePage() {
  const session = await auth();


  if (!session?.user?.id) {
    redirect("/auth/sign-in?message=signin_required");
  }


  let matches, aiDescription;

  try {
    const result = await findMatches(session.user.id);
    matches = result.matches;
    aiDescription = result.aiDescription;
  } catch (err: any) {
    if (err.message === "User or preferences not found") {
      redirect("/onboarding");
    }
    throw err;
  }
  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-2 text-dark dark:text-white">Possible Matches</h1>
      <p className="text-gray-700 dark:text-gray-300 mb-2">{aiDescription}</p>

      {matches.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          No matches found at the moment. Please check back later.
        </p>
      ) : (
        <div className="flex flex-col gap-6">
          {matches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              userId={session.user.id}
              onSubmit={async (id, message) => {
                "use server";
                await sendMatchRequest({ matchId: id, message });
              }}
            />
          ))}
        </div>
      )}
    </main>
  );
}
