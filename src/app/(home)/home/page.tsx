
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


export default async function HomePage() {
  const session = await auth();
  if (!session?.user?.id) return <div className="p-6 text-red-600">You must be logged in.</div>;

  const { matches, aiDescription } = await findMatches(session.user.id);

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-2 text-dark dark:text-white">Possible Matches</h1>
      <p className="text-gray-700 dark:text-gray-300 mb-6">{aiDescription}</p>

      {matches.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          No matches found at the moment. Please check back later.
        </p>
      ) : (
        <>
          {/* --- First UI block (Link version) --- */}
          <div className="flex flex-col gap-6">
            {matches.map((match) => (
              <Link href={`/matches/${match.id}`} key={match.id} className="group">
                <div className="bg-white dark:bg-dark dark:shadow-card text-white rounded-2xl shadow-lg flex gap-4 mb-5">
                  {/* Profile Image */}
                  <div className="flex-shrink-0">
                    <Image
                      src={match.image || match.imageUrl || "/images/user/default.png"}
                      alt={match.name}
                      width={170}
                      height={150}
                      className="rounded-s-xl object-cover bg-gray-2 h-full border-r-4 border-primary"
                    />
                  </div>

                  {/* Roommate Details */}
                  <div className="flex-1 p-6">
                    <h2 className="text-[22px] text-black dark:text-white font-semibold pb-1">{match.name}</h2>
                    <p className="text-gray-400 text-sm flex flex-wrap gap-2">
                      {match.preferences?.country && <span>From {match.preferences.country} •</span>}
                      {match.preferences?.age && <span>{match.preferences.age} years •</span>}
                      {match.preferences?.genderPreference && <span>{match.preferences.genderPreference} •</span>}
                      {match.preferences?.occupation && <span>{match.preferences.occupation} •</span>}
                      {match.preferences?.maxBudget && <span>Max Budget: ${match.preferences.maxBudget}</span>}
                    </p>

                    {/* Bio */}
                    {match.bio && (
                      <p className="mt-2 text-gray-300 text-base leading-relaxed">
                        {match.bio} <span className="text-blue-400 cursor-pointer">more</span>
                      </p>
                    )}

                    {/* Location */}
                    {match.preferences?.preferredLocation && (
                      <p className="mt-2 text-gray-400 text-sm pb-3">
                        <span className="font-semibold">Roommate Looking:</span>{" "}
                        {match.preferences.preferredLocation}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-5 xl:gap-2">
                      <Button
                        label="Chat"
                        variant="outlinePrimary"
                        shape="rounded"
                        size="small"
                        icon={<MessageOutlineIcon />}
                      />
                      <Button
                        label="Remove"
                        variant="outlinePrimary"
                        shape="rounded"
                        size="small"
                        className="border-red-400 text-red-400 dark:text-red-400"
                        icon={<RemoveIcon />}
                      />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* --- Second UI block (MatchCard version) --- */}
          <div className="flex flex-col gap-6 mt-12">
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
        </>
      )}
    </main>
  );
}
