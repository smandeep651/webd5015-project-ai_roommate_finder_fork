// src/pages/api/socket/io.ts
import { Server as NetServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import type { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = (_req: NextApiRequest, res: NextApiResponse) => {
  if (!res.socket.server.io) {
    console.log("🔌 New Socket.IO server...");

    const httpServer = res.socket.server as any as NetServer;
    const io = new SocketIOServer(httpServer, {
      path: "/api/socket/io",
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("✅ Client connected:", socket.id);
    });
  } else {
    console.log("⚠️ Socket.IO already running.");
  }

  res.end();
};

export default ioHandler;
