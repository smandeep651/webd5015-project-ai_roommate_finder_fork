"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";
import ConfirmModal from "../ConfirmModal"; // Import your ConfirmModal component

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
  onRemove: () => void;  // Call this function after removal
}

export default function ChatBox({ match, currentUserId, onRemove }: ChatBoxProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false); // State for showing the confirmation modal

  useEffect(() => {
    // Connect to socket
    socketRef.current = io({
      path: "/api/socket/io",
    });

    socketRef.current.on("connect", () => {
      console.log("Connected to socket:", socketRef.current?.id);
    });

    socketRef.current.on("private_message", (msg: Message) => {
      if (
        (msg.senderId === match.id && msg.receiverId === currentUserId) ||
        (msg.senderId === currentUserId && msg.receiverId === match.id)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [match.id, currentUserId]);

  useEffect(() => {
    // Load message history
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
      if (data.success) {
        setMessages(data.messages);
      }
    };

    loadMessages();
  }, [match.id, currentUserId]);

  const handleSend = async () => {
    if (!message.trim()) return;
  
    const cleanMsg = {
      senderId: currentUserId,
      receiverId: match.id,
      message,
    };
  
    // Emit to socket
    socketRef.current?.emit("private_message", {
      ...cleanMsg,
      timestamp: new Date().toISOString(),
      id: `${Date.now()}`, // only for local UI
    });
  
    // Send to server
    const response = await fetch("/api/messages/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cleanMsg), // ✅ NOT the one with id
    });
  
    if (!response.ok) {
      console.error("❌ Failed to save message");
      return;
    }
  
    const data = await response.json();
  
    setMessages((prev) => [...prev, data.message]);
    setMessage("");
  };

  const handleRemove = async () => {
    setShowConfirm(true); // Show confirmation modal
  
    // Make the remove request
    const response = await fetch("/api/match/delete", {
      method: "POST",
      body: JSON.stringify({ matchId: match.id }),
      headers: { "Content-Type": "application/json" },
    });
  
    // Log the response for debugging
 
    if (response.ok) {
      onRemove();
      router.push("/matches/matched");
    } else {
      const errorData = await response.json();
      console.error("Failed to remove match:", errorData);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col">
      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)} // Close modal without doing anything
        onConfirm={handleRemove} // Call handleRemove on confirmation
      />

      {/* Top Bar */}
      <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <button onClick={() => router.back()} className="text-white font-semibold">
          ← Back
        </button>
        <span className="font-semibold text-lg">{match.name || "Matched User"}</span>
        <button
          onClick={() => setShowConfirm(true)} // ✅ only opens modal
          className="text-white opacity-70 hover:opacity-100"
        >
  🚫
      </button>

      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-100">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded shadow w-fit max-w-xs ${msg.senderId === currentUserId ? "bg-blue-200 text-black ml-auto" : "bg-white  text-black"}`}
          >
            {msg.message}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t flex gap-2">
        <input
          className="flex-1 border rounded p-2"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}
