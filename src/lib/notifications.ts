import { db } from "./db";

export async function createNotification({
  type,
  message,
  senderId,
  receiverId,
}: {
  type: "match-request" | "request-approved" | "message";
  message: string;
  senderId: string;
  receiverId: string;
}) {
  return await db.notification.create({
    data: {
      type,
      message,
      senderId,
      receiverId,
    },
  });
}

export async function getUserNotifications(userId: string) {
  return await db.notification.findMany({
    where: { receiverId: userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function markAsRead(notificationId: string) {
  return await db.notification.update({
    where: { id: notificationId },
    data: { read: true },
  });
}
