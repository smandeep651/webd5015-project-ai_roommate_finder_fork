"use client";

import { createContext, useContext, useEffect, useState } from "react";
import socket from "@/lib/socket";

type Message = {
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
};

type ChatContextType = {
  messages: Message[];
  sendMessage: (msg: Omit<Message, "timestamp">) => void;
};

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    socket.on("message", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("message");
    };
  }, []);

  const sendMessage = (msg: Omit<Message, "timestamp">) => {
    const fullMessage: Message = {
      ...msg,
      timestamp: new Date().toISOString(),
    };

    socket.emit("message", fullMessage);
    setMessages((prev) => [...prev, fullMessage]);
  };

  return (
    <ChatContext.Provider value={{ messages, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within a ChatProvider");
  return ctx;
};

