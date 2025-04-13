import { getMatchDetails } from "@/lib/aiMatcher";
import Image from "next/image";
import Link from "next/link";

export default async function MatchDetailsPage({ params }: { params: { id: string } }) {
  const match = await getMatchDetails(params.id);

  if (!match) return <div className="p-6 text-red-600">Match not found.</div>;

  return (  
    <div className="max-w-3xl mx-auto p-6 m-6 bg-white dark:bg-dark rounded-2xl shadow-md">
      {/* Profile Image + Basic Info */}

      <div className="text-left">
        <Link href="/" className="text-primary hover:underline">
          ← Back to matches
        </Link>
      </div>
      <div className="flex flex-col items-center text-center mb-6">
        <Image
          src={match.image || "/images/user/default.png"}
          alt={match.name}
          width={140}
          height={140}
          className="rounded-full object-cover mb-4 border-4 border-primary"
        />
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{match.name}</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Looking for {match.preferences?.genderPreference || "Not specified"} Roommate · {match.preferences?.age || "N/A"} years old ·{" "}
          {match.preferences?.occupation || "Occupation unknown"}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-3 justify-center">
          <span className="px-3 py-1 text-sm rounded-full bg-red-100 text-red-600 font-medium">{match.preferences?.ethnicity}</span>
          <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-600 font-medium">{match.preferences?.sex}</span>
          <span className="px-3 py-1 text-sm rounded-full bg-pink-100 text-pink-600 font-medium">{match.preferences?.occupation}</span>
        </div>
      </div>

      {/* Details Section */}
      <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
        <div>
          <strong>Looking in:</strong>{" "}
          <span className="text-base font-medium text-gray-800 dark:text-white">
            {match.preferences?.preferredLocation || "N/A"}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <div>
            <strong>Budget</strong>
            <p>${match.preferences?.maxBudget || "N/A"} per month</p>
          </div>
          <div>
            <strong>Accommodation Type</strong>
            <p>{match.preferences?.accommodationType || "N/A"}</p>
          </div>
          <div>
            <strong>Pets</strong>
            <p>{match.preferences?.petType || "N/A"}</p>
          </div>
          <div>
            <strong>Sleep Pattern</strong>
            <p>{match.preferences?.sleepPattern || "N/A"}</p>
          </div>
          <div>
            <strong>Cooking</strong>
            <p>{match.preferences?.cooking || "N/A"}</p>
          </div>
        </div>

        {/* Preferences */}
        <div className="flex flex-wrap gap-2 pt-4">
          {match.preferences?.drinking && (
            <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">🌲 Cannabis friendly</span>
          )}
          {match.preferences?.smoking === false && (
            <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded">🚭 Non-smoker</span>
          )}
          {match.preferences?.teamingUp && (
            <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">🙌 Interested in teaming-up</span>
          )}
        </div>

        {/* Description */}
        <div className="pt-4">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">📝 Bio</h3>
          <p className="text-gray-600 dark:text-gray-300">
            {match.bio || "No description provided yet."}
          </p>
        </div>
      </div>
      
    </div>
  );
}
