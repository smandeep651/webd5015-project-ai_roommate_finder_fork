
import { auth } from "@/lib/actions";
import { findMatches } from "@/lib/aiMatcher";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import MatchCard from "../_components/MatchCard";
import { sendMatchRequest } from "@/actions/sendMatchRequest";


export default async function HomePage() {
  const session = await auth();
  if (!session?.user?.id) return <div className="p-6 text-red-600">You must be logged in.</div>;

  const { matches, aiDescription } = await findMatches(session.user.id);

  return (
    <main className="p-6">
      <h1 className="dark:text-white text-black text-3xl font-bold mb-2">Possible Matches</h1>
      <p className="text-gray-700 mb-6">{aiDescription}</p>

      {matches.length === 0 ? (
        <p className="text-gray-500">No matches found at the moment.</p>
      ) : (
        <div className="flex flex-col gap-4">
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
