import { io } from "socket.io-client";

let socket: any;

export function sendMatchRequestSocket({ senderId, receiverId, message }: {
  senderId: string;
  receiverId: string;
  message: string;
}) {
  if (!socket) {
    socket = io({ path: "/api/socket/io" });
  }

  socket.emit("match-request", { senderId, receiverId, message });
}
