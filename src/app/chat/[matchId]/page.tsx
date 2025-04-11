// src/app/(home)/chat/[matchId]/page.tsx

import { auth } from "@/lib/actions";
import { db } from "@/lib/db";
import ChatClient from "./ChatPageClient";

interface ChatPageProps {
  params: {
    matchId: string;
  };
}

export default async function ChatPage({ params }: { params: { matchId: string } }) {
  const session = await auth();
  if (!session?.user?.id) return <div>Unauthorized</div>;

  const matchUser = await db.user.findUnique({
    where: { id: params.matchId },
    select: {
      id: true,
      name: true,
      image: true,
    },
  });

  if (!matchUser) return <div>User not found</div>;

  return (
    <ChatClient
      match={{
        id: matchUser.id,
        name: matchUser.name ?? "Unnamed",
        image: matchUser.image ?? undefined,
      }}
      currentUserId={session.user.id}
    />
  );
}
