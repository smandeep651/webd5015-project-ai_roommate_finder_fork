import { auth } from "@/lib/actions";
import { db } from "@/lib/db";
import MatchedClient from "./MatchedClient";

export default async function MatchedPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const matches = await db.match.findMany({
    where: {
      status: "accepted",
      OR: [
        { userId: session.user.id },
        { matchId: session.user.id },
      ],
    },
    include: {
      sender: true,
      receiver: true,
    },
  });

  // Decide who the "other user" is
  const formattedMatches = await Promise.all(
    matches.map(async (match) => {
      const otherUser =
        match.userId === session.user.id ? match.receiver : match.sender;
  
      const lastMessage = await db.message.findFirst({
        where: {
          OR: [
            { senderId: session.user.id, receiverId: otherUser.id },
            { senderId: otherUser.id, receiverId: session.user.id },
          ],
        },
        orderBy: {
          timestamp: "desc",
        },
      });
  
      return {
        id: match.id,
        ...otherUser,
        lastMessage: lastMessage?.message || "No messages yet",
        lastMessageSender: lastMessage?.senderId,
      };
    })
  );
  

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6">Matched Users</h1>
      <MatchedClient matches={formattedMatches} />
    </main>
  );
}
