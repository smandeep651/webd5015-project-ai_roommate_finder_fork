// // src/pages/api/socket/io.ts
// import { Server as NetServer } from "http";
// import { Server as SocketIOServer } from "socket.io";
// import type { NextApiRequest, NextApiResponse } from "next";
// import { createNotification } from "@/lib/notifications";

// export const config = { api: { bodyParser: false } };

// const ioHandler = (_req: NextApiRequest, res: NextApiResponse) => {
//   if (!res.socket.server.io) {
//     const httpServer = res.socket.server as any as NetServer;
//     const io = new SocketIOServer(httpServer, {
//       path: "/api/socket/io",
//       cors: {
//         origin: "*",
//         methods: ["GET", "POST"],
//       },
//     });

//     res.socket.server.io = io;

//     io.on("connection", (socket) => {
//       socket.on("join", (userId: string) => {
//         socket.join(userId);
//       });

//       socket.on("private-message", async ({ senderId, receiverId, message }) => {
//         try {
//           const { db } = await import("@/lib/db");

//           const saved = await db.message.create({
//             data: {
//               senderId,
//               receiverId,
//               message,
//               timestamp: new Date(),
//             },
//           });

//           const sender = await db.user.findUnique({ where: { id: senderId } });

//           if (sender) {
//             const notification = await createNotification({
//               type: "message",
//               message: `New message from ${sender.name}`,
//               senderId,
//               receiverId,
//             });

//             io.to(receiverId).emit("new-notification", {
//               ...notification,
//               sender: { name: sender.name, image: sender.image },
//             });
//           }



//           // Send the saved message to both parties
//           io.to(senderId).emit("new-message", saved);
//           io.to(receiverId).emit("new-message", saved);

//           // Trigger chat refresh
//           io.to(senderId).emit("refresh-chats");
//           io.to(receiverId).emit("refresh-chats");


//         } catch (err) {
//           console.error("❌ Socket error:", err);
//         }
//       });

//     });
//   }

//   res.end();
// };

// export default ioHandler;


// ✅ File: src/pages/api/socket/io.ts

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

        const existing = await db.match.findFirst({ where: { userId: senderId, matchId: receiverId } });
        if (existing) return;

        await db.match.create({
          data: { userId: senderId, matchId: receiverId, message, status: "pending" },
        });

        if (message?.trim()) {
          await db.message.create({
            data: { senderId, receiverId, message, timestamp: new Date() },
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

        console.log("📤 Emitting refresh-requests to:", receiverId);
        io.to(receiverId).emit("refresh-requests");
      });
    });
  }

  res.end();
};

export default ioHandler;
