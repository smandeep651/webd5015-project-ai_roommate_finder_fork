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
          className="cursor-pointer border p-4 bg-white rounded-xl shadow hover:shadow-lg transition"
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
              <h2 className="font-semibold">{match.name}</h2>
              <p className="text-sm text-gray-600 italic truncate max-w-xs">
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
