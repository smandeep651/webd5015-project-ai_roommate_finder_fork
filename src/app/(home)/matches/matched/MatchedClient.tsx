"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function MatchedClient({ matches }: { matches: any[] }) {
  const router = useRouter();

  if (!matches || matches.length === 0) {
    return <p className="text-gray-500">No matches right now.</p>;
  }

  // Ideally pass currentUserId from props, but fallback logic:
  const getCurrentUserId = () => {
    if (typeof window !== "undefined") {
      const session = JSON.parse(localStorage.getItem("session") || "{}");
      return session?.user?.id;
    }
    return null;
  };

  const currentUserId = getCurrentUserId();

  return (
    <div className="space-y-6">
      {matches.map((match) => (
        <div
          key={match.id}
          onClick={() => router.push(`/chat/${match.id}`)}
          className="cursor-pointer p-4 bg-white dark:bg-dark-2 rounded-2xl shadow hover:shadow-lg transition"
        >
          <div className="flex items-center gap-4">
            <Image
              src={match.image || "/images/user/default.png"}
              alt={match.name}
              width={60}
              height={60}
              className="rounded-full object-cover"
            />
            <div>
              <h2 className="font-semibold text-gray-800 dark:text-gray-1 text-lg">{match.name}</h2>
              <p className="text-gray-800 dark:text-gray-4 mb-3 italic">
                {match.lastMessageSender === currentUserId ? "You: " : ""}
                {match.lastMessage || "No messages yet"}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
