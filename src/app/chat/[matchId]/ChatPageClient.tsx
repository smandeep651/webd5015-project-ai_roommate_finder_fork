"use client";

import { useState } from "react";
import ChatBox from "@/app/(home)/_components/chat/ChatBox";

interface ChatClientProps {
  match: {
    id: string;
    name: string | null;
    image?: string | null;
  };
  currentUserId: string;
}

export default function ChatClient({ match, currentUserId }: ChatClientProps) {
  const [removed, setRemoved] = useState(false);

  if (removed) {
    return <div className="p-6 text-red-500">You removed this match.</div>;
  }

  return (
    <ChatBox
      match={match}
      currentUserId={currentUserId}
      onRemove={() => setRemoved(true)}
    />
  );
}
