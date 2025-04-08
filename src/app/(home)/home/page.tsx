import { auth } from "@/lib/actions";
import { findMatches } from "@/lib/aiMatcher";
import Image from "next/image";

export default async function HomePage() {
  const session = await auth();

  if (!session?.user?.id) {
    return <div className="p-6 text-red-600">You must be logged in to see matches.</div>;
  }

  const { matches, aiDescription } = await findMatches(session.user.id);

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-4">Possible Matches</h1>
      <p className="text-gray-700 mb-8">{aiDescription}</p>

      {matches.length === 0 ? (
        <p className="text-gray-500">No matches found at the moment. Please check back later.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {matches.map((match) => (
            <div
              key={match.id}
              className="w-full bg-white rounded-xl shadow-md border p-6 hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-6 mb-4">
                <Image
                  src={match.image || match.imageUrl || "/images/user/default.png"}
                  alt={match.name}
                  width={80}
                  height={80}
                  className="rounded-full object-cover"
                />
                <div>
                  <h2 className="font-semibold text-xl">{match.name}</h2>
                  <p className="text-sm text-gray-500">{match.preferences?.occupation}</p>
                  <p className="text-sm text-gray-600 italic">{match.bio}</p>
                </div>
              </div>

              <div className="text-sm text-gray-700 space-y-1 pl-1">
                <p><strong>Preferred Location:</strong> {match.preferences?.preferredLocation}</p>
                <p><strong>Age Range:</strong> {match.preferences?.minAge} - {match.preferences?.maxAge}</p>
                <p><strong>Budget:</strong> ${match.preferences?.minBudget} - ${match.preferences?.maxBudget}</p>
                <p><strong>Accommodation Type:</strong> {match.preferences?.accommodationType}</p>
                <p><strong>Habits:</strong> {match.preferences?.sleepPattern} | Drinking: {match.preferences?.drinking ? 'Yes' : 'No'} | Smoking: {match.preferences?.smoking ? 'Yes' : 'No'}</p>
                <p><strong>Cooking:</strong> {match.preferences?.cooking}</p>
                <p><strong>Pets:</strong> {match.preferences?.hasPets ? `Yes (${match.preferences?.petType || 'N/A'})` : 'No'}</p>
                <p><strong>Gender Preference:</strong> {match.preferences?.genderPreference}</p>
                <p><strong>Ethnicity:</strong> {match.preferences?.ethnicity}</p>
                <p><strong>Religion:</strong> {match.preferences?.religion}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
