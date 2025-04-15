"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { io } from "socket.io-client";

type Match = {
  id: string;
  name: string;
  image?: string;
  lastMessage?: string;
  lastMessageSender?: string;
};

export default function MatchedClient({
  initialMatches,
  currentUserId,
}: {
  initialMatches: Match[];
  currentUserId: string;
}) {
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>(initialMatches);

  useEffect(() => {
    const socket = io({ path: "/api/socket/io" });

    socket.on("connect", () => {
      socket.emit("join", currentUserId);
    });

    socket.on("refresh-chats", () => {
      // 👇 Instead of waiting for fetch, we'll wait 100ms and optimistically assume the message was sent
      setTimeout(() => {
        fetch("/api/match/chats")
          .then((res) => res.json())
          .then((data) => setMatches(data))
          .catch((err) => console.error("❌ Failed to fetch updated matches:", err));
      }, 10); 
    });

    return () => {
      socket.disconnect();
    };
  }, [currentUserId]);

  if (!matches || matches.length === 0) {
    return <p className="text-gray-500">No matches right now.</p>;
  }

  return (
    <div className="space-y-6">
      {matches.map((match) => (
        <div
          key={match.id}
          onClick={() => {
            sessionStorage.setItem("refresh-matched", "true");
            router.push(`/chat/${match.id}`);
          }}
          className="cursor-pointer p-4 bg-white dark:bg-dark rounded-2xl shadow hover:shadow-lg transition"
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
