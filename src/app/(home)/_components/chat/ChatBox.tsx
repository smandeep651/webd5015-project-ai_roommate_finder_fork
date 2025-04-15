"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";
import ConfirmModal from "../ConfirmModal";

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: string;
}

interface ChatBoxProps {
  match: {
    id: string;
    name: string | null;
    image?: string | null;
  };
  currentUserId: string;
  onRemove: () => void;
}

export default function ChatBox({ match, currentUserId, onRemove }: ChatBoxProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const router = useRouter();
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    socketRef.current = io({ path: "/api/socket/io" });

    socketRef.current.on("connect", () => {
      socketRef.current?.emit("join", currentUserId);
    });

    socketRef.current.on("new-message", (msg: Message) => {
      setMessages((prev) => {
        const idx = prev.findIndex(
          (m) => m.id.startsWith("temp-") && m.senderId === msg.senderId && m.message === msg.message
        );
        if (idx !== -1) {
          const updated = [...prev];
          updated[idx] = msg;
          return updated;
        }
        if (!prev.some((m) => m.id === msg.id)) {
          return [...prev, msg];
        }
        return prev;
      });
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [currentUserId]);

  useEffect(() => {
    const loadMessages = async () => {
      const res = await fetch("/api/messages/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user1: currentUserId,
          user2: match.id,
        }),
      });

      const data = await res.json();
      if (data.success) setMessages(data.messages);
    };

    loadMessages();
  }, [match.id, currentUserId]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!message.trim()) return;

    const tempMsg: Message = {
      id: `temp-${Date.now()}`,
      senderId: currentUserId,
      receiverId: match.id,
      message,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempMsg]);

    // ✅ Use "text" instead of "message" field to avoid Prisma conflict
    socketRef.current?.emit("private-message", {
      roomId: match.id,
      message: {
        senderId: tempMsg.senderId,
        receiverId: tempMsg.receiverId,
        text: tempMsg.message,
      },
    });

    setMessage("");
  };

  const handleRemove = async () => {
    setShowConfirm(true);
    const res = await fetch("/api/match/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ matchId: match.id }),
    });

    if (res.ok) {
      onRemove();
      router.push("/matches/matched");
    }
  };

  return (
    <div className="w-full h-screen flex flex-col">
      <ConfirmModal isOpen={showConfirm} onClose={() => setShowConfirm(false)} onConfirm={handleRemove} />

      <div className="border-b p-4 bg-white dark:bg-gray-dark text-white flex justify-between">
        <button
          onClick={() => {
            sessionStorage.setItem("refresh-matched", "true");
            router.push("/matches/matched");
          }}
          className="font-semibold"
        >
          ← Back
        </button>
        <span className="font-semibold">{match.name || "Matched User"}</span>
        <button onClick={() => setShowConfirm(true)} className="text-red-500">
          Delete Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-white dark:bg-dark">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-2 rounded shadow max-w-xs w-fit ${
              msg.senderId === currentUserId ? "ml-auto bg-gray-1" : "bg-gray-2"
            } text-black`}
          >
            {msg.message}
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>

      <div className="p-4 flex gap-2">
        <input
          className="flex-1 border rounded p-2"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={handleSend} className="bg-primary text-white px-4 py-2 rounded">
          Send
        </button>
      </div>
    </div>
  );
}
