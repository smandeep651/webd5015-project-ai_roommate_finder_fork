import { Server } from "socket.io";
import { NextApiRequest, NextApiResponse } from "next";

const ioHandler = (_: NextApiRequest, res: NextApiResponse) => {
  if ((res.socket as any).server.io) {
    console.log("Socket already running");
    res.end();
    return;
  }

  const io = new Server((res.socket as any).server, {
    path: "/api/socket/io",
  });

  (res.socket as any).server.io = io;

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join", ({ room }) => {
      socket.join(room);
      console.log(`User ${socket.id} joined room ${room}`);
    });

    socket.on("private_message", ({ room, message }) => {
      console.log(`Message to ${room}: ${message}`);
      socket.to(room).emit("new_message", message);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  res.end("Socket.IO server running");
};

export default ioHandler;
