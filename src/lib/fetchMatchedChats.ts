import { db } from "@/lib/db";

export async function fetchMatchedChats(userId: string) {
  const matches = await db.match.findMany({
    where: {
      status: "accepted",
      OR: [
        { userId },
        { matchId: userId },
      ],
    },
    include: {
      sender: true,
      receiver: true,
    },
  });

  return await Promise.all(
    matches.map(async (match) => {
      const otherUser = match.userId === userId ? match.receiver : match.sender;

      const lastMessage = await db.message.findFirst({
        where: {
          OR: [
            { senderId: userId, receiverId: otherUser.id },
            { senderId: otherUser.id, receiverId: userId },
          ],
        },
        orderBy: { timestamp: "desc" },
      });

      return {
        id: match.id,
        ...otherUser,
        lastMessage: lastMessage?.message || "No messages yet",
        lastMessageSender: lastMessage?.senderId,
      };
    })
  );
}
