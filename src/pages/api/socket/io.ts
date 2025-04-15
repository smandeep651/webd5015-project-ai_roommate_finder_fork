import { Server as NetServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import type { NextApiRequest, NextApiResponse } from "next";
import { createNotification } from "@/lib/notifications";

export const config = { api: { bodyParser: false } };

const ioHandler = (_req: NextApiRequest, res: NextApiResponse) => {
  if (!res.socket.server.io) {
    const httpServer = res.socket.server as any as NetServer;
    const io = new SocketIOServer(httpServer, {
      path: "/api/socket/io",
      cors: { origin: "*", methods: ["GET", "POST"] },
    });

    (global as any).io = io;
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      socket.on("join", (userId: string) => {
        socket.join(userId);
        console.log("✅ Joined socket room:", userId);
      });

      socket.on("match-request", async ({ senderId, receiverId, message }) => {
        console.log("📩 match-request received", { senderId, receiverId, message });
        const { db } = await import("@/lib/db");

        const existing = await db.match.findFirst({
          where: { userId: senderId, matchId: receiverId },
        });
        if (existing) return;

        await db.match.create({
          data: { userId: senderId, matchId: receiverId, message, status: "pending" },
        });

        if (message?.trim()) {
          await db.message.create({
            data: {
              senderId,
              receiverId,
              message,
              status: "sent",
            },
          });
        }

        const sender = await db.user.findUnique({ where: { id: senderId } });

        const notification = await createNotification({
          type: "match-request",
          message: `${sender?.name} sent you a match request.`,
          senderId,
          receiverId,
        });

        io.to(receiverId).emit("new-notification", {
          ...notification,
          sender: { name: sender?.name, image: sender?.image },
        });

        io.to(receiverId).emit("refresh-requests");
      });
      socket.on("private-message", async ({ roomId, message }) => {
        try {
          console.log("💬 private-message received:", message);
          const { db } = await import("@/lib/db");
      
          if (!message?.senderId || !message?.receiverId || !message?.text) {
            console.warn("❌ Missing required message fields. Skipping...");
            return;
          }
      
          // Save message to DB
          const saved = await db.message.create({
            data: {
              senderId: message.senderId,
              receiverId: message.receiverId,
              message: message.text,
              status: "sent",
            },
          });
      
          // Fetch sender details
          const sender = await db.user.findUnique({
            where: { id: message.senderId },
            select: { name: true, image: true },
          });
      
          // ✅ Create message notification
          const notification = await createNotification({
            type: "message",
            message: `${sender?.name || "Someone"} sent you a message.`,
            senderId: message.senderId,
            receiverId: message.receiverId,
          });

          console.log("🔔 Notification created:", notification);

      
          // ✅ Emit notification to receiver
          io.to(message.receiverId).emit("new-notification", {
            ...notification,
            sender: { name: sender?.name, image: sender?.image },
          });
      
          // ✅ Emit real-time message
          io.to(roomId).emit("new-message", {
            ...saved,
          });
      
          console.log("📤 Emitted new-message + notification to:", message.receiverId);
        } catch (err) {
          console.error("❌ Failed to handle private-message:", err);
        }
      });
      
    
    });
  }

  res.end();
};

export default ioHandler;
