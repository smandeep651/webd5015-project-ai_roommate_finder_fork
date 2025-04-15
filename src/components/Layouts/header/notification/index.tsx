"use client";

import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "@/components/ui/dropdown";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BellIcon } from "./icons";
import { io, Socket } from "socket.io-client";
import { useSession } from "next-auth/react";

type NotificationType = {
  id: string;
  message: string;
  createdAt: string;
  read: boolean;
  type: string;
  senderId?: string;
  receiverId?: string;
  sender?: {
    name?: string;
    image?: string;
  };
};

function getRedirectUrl(notification: NotificationType): string {
  switch (notification.type) {
    case "match-request":
      return "/matches/requests";
    case "message":
      return `/chat/${notification.senderId}`;
    case "request-approved":
      return "/matches/matched";
    default:
      return "/";
  }
}

export function Notification() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDotVisible, setIsDotVisible] = useState(true);
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const isMobile = useIsMobile();
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch("/api/notifications");
        const data = await res.json();
        setNotifications(data);
      } catch (err) {
        console.error("❌ Failed to fetch notifications:", err);
      }
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    const socket: Socket = io({ path: "/api/socket/io" });

    socket.on("connect", () => {
      console.log("✅ Connected to socket:", socket.id);  
      if (session?.user?.id) {
        socket.emit("join", session.user.id);
      }
    });

    socket.on("new-notification", (notif: NotificationType) => {
      console.log("📩 Notification received:", notif);

      // Fallback match: if receiverId includes or equals current user ID
      if (!notif?.receiverId || !session?.user?.id) return;

      const userId = session.user.id;

      if (
        notif.receiverId === userId ||
        notif.receiverId.toString().includes(userId)
      ) {
        setNotifications((prev) => [...prev, notif]);
        setIsDotVisible(true);
      }
    });


    return () => {
      socket.disconnect();
    };
  }, [session?.user?.id]);

  const handleClick = async (notification: NotificationType) => {
    setIsOpen(false);

    try {
      await fetch("/api/notifications/mark-read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notificationId: notification.id,
          senderId: notification.senderId,
          type: notification.type,
        }),
      });

      setNotifications((prev) =>
        prev.filter((n) => n.id !== notification.id)
      );

      router.push(getRedirectUrl(notification));
    } catch (err) {
      console.error("❌ Failed to mark notification as read:", err);
    }
  };

  return (
    <Dropdown
      isOpen={isOpen}
      setIsOpen={(open) => {
        setIsOpen(open);
        if (setIsDotVisible) setIsDotVisible(false);
      }}
    >
      <DropdownTrigger
        className="grid size-12 place-items-center rounded-full border bg-gray-2 text-dark outline-none hover:text-primary focus-visible:border-primary focus-visible:text-primary dark:border-dark-4 dark:bg-dark-3 dark:text-white dark:focus-visible:border-primary"
        aria-label="View Notifications"
      >
        <span className="relative">
          <BellIcon />
          {isDotVisible && notifications.length > 0 && (
            <span
              className={cn(
                "absolute right-0 top-0 z-1 size-2 rounded-full bg-red-light ring-2 ring-gray-2 dark:ring-dark-3"
              )}
            >
              <span className="absolute inset-0 -z-1 animate-ping rounded-full bg-red-light opacity-75" />
            </span>
          )}
        </span>
      </DropdownTrigger>

      <DropdownContent
        align={isMobile ? "end" : "center"}
        className="border border-stroke bg-white px-3.5 py-3 shadow-md dark:border-dark-3 dark:bg-gray-dark min-[350px]:min-w-[20rem]"
      >
        <div className="mb-1 flex items-center justify-between px-2 py-1.5">
          <span className="text-lg font-medium text-dark dark:text-white">
            Notifications
          </span>
          <span className="rounded-md bg-primary px-[9px] py-0.5 text-xs font-medium text-white">
            {notifications.length} new
          </span>
        </div>

        <ul className="mb-3 max-h-[23rem] space-y-1.5 overflow-y-auto">
          {notifications.length === 0 ? (
            <li className="text-sm text-center text-gray-500 py-4">
              No notifications yet
            </li>
          ) : (
            notifications.map((item) => (
              <li
                key={item.id}
                role="menuitem"
                onClick={() => handleClick(item)}
                className="cursor-pointer"
              >
                <div className="flex items-center gap-4 rounded-lg px-2 py-1.5 outline-none hover:bg-gray-2 focus-visible:bg-gray-2 dark:hover:bg-dark-3 dark:focus-visible:bg-dark-3">
                  <Image
                    src={item.sender?.image || "/images/default-avatar.png"}
                    className="size-14 rounded-full object-cover"
                    width={200}
                    height={200}
                    alt="User"
                  />

                  <div>
                    <strong className="block text-sm font-medium text-dark dark:text-white">
                      {item.message}
                    </strong>

                    <span className="truncate text-xs font-medium text-dark-5 dark:text-dark-6">
                      {new Date(item.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>

        <Link
          href="#"
          onClick={() => setIsOpen(false)}
          className="block rounded-lg border border-primary p-2 text-center text-sm font-medium tracking-wide text-primary outline-none transition-colors hover:bg-blue-light-5 focus:bg-blue-light-5 focus:text-primary focus-visible:border-primary dark:border-dark-3 dark:text-dark-6 dark:hover:border-dark-5 dark:hover:bg-dark-3 dark:hover:text-dark-7 dark:focus-visible:border-dark-5 dark:focus-visible:bg-dark-3 dark:focus-visible:text-dark-7"
        >
          See all notifications
        </Link>
      </DropdownContent>
    </Dropdown>
  );
}
