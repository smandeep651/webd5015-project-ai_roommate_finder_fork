// // import { auth } from "@/lib/actions";
// // import { db } from "@/lib/db";
// // import { NextResponse } from "next/server";
// // import { startOfDay, endOfDay } from "date-fns";
// // import { createNotification } from "@/lib/notifications";
// // import { Server as SocketIOServer } from "socket.io";


// // let ioInstance: SocketIOServer | null = null;
// // function getIO(res: any) {
// //   if (!ioInstance && res?.socket?.server?.io) {
// //     ioInstance = res.socket.server.io;
// //   }
// //   return ioInstance;
// // }

// // export async function POST(req: Request) {
// //   const session = await auth();
// //   if (!session?.user?.id) {
// //     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
// //   }

// //   const userId = session.user.id;
// //   const { matchId, message } = await req.json();

// //   if (!matchId) {
// //     return NextResponse.json({ error: "Match ID is required" }, { status: 400 });
// //   }

// //   // Check if already sent
// //   const existing = await db.match.findFirst({
// //     where: {
// //       userId,
// //       matchId,
// //     },
// //   });

// //   if (existing) {
// //     return NextResponse.json({ error: "Request already sent" }, { status: 400 });
// //   }

// //   // Check premium status
// //   const user = await db.user.findUnique({
// //     where: { id: userId },
// //     select: { isPremium: true },
// //   });

// //   if (!user?.isPremium) {
// //     const todayStart = startOfDay(new Date());
// //     const todayEnd = endOfDay(new Date());

// //     const requestsToday = await db.match.count({
// //       where: {
// //         userId,
// //         createdAt: {
// //           gte: todayStart,
// //           lte: todayEnd,
// //         },
// //       },
// //     });

// //     if (requestsToday >= 3) {
// //       return NextResponse.json({
// //         error: "You've reached your daily request limit. Upgrade to premium to send more.",
// //       }, { status: 403 });
// //     }
// //   }

// //   // Create match
// //   const match = await db.match.create({
// //     data: {
// //       userId,
// //       matchId,
// //       message,
// //       status: "pending",
// //     },
// //   });

// //   // Optional: Save the message
// //   try {
// //     if (message && message.trim().length > 0) {
// //       await db.message.create({
// //         data: {
// //           senderId: userId,
// //           receiverId: matchId,
// //           message,
// //           timestamp: new Date(),
// //         },
// //       });
// //     }
// //   } catch (error) {
// //     console.error("❌ Failed to save message:", error);
// //   }

// //   try {
// //     const sender = await db.user.findUnique({ where: { id: userId } });
// //     const receiver = await db.user.findUnique({ where: { id: matchId } });

// //     if (sender && receiver) {
// //       const notification = await createNotification({
// //         type: "match-request",
// //         message: `${sender.name} sent you a match request.`,
// //         senderId: sender.id,
// //         receiverId: receiver.id,
// //       });

// //         // ✅ Emit real-time match-request notification
// //         if (res?.socket?.server?.io && receiver) {
// //           const io = res.socket.server.io;
// //           io.to(receiver.id).emit("new-notification", {
// //             id: notification.id,
// //             type: notification.type,
// //             message: notification.message,
// //             senderId: sender.id,
// //             receiverId: receiver.id,
// //             createdAt: notification.createdAt,
// //             read: false,
// //             sender: {
// //               name: sender.name,
// //               image: sender.image,
// //             },
// //           });

// //           io.to(receiver.id).emit("refresh-requests");
        
// //         }
// //     }
// //   } catch (error) {
// //     console.error("❌ Failed to create notification:", error);
// //   }

// //   return NextResponse.json({ success: true, match });
// // }

// // export async function GET() {
// //   const session = await auth();
// //   if (!session?.user?.id) {
// //     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
// //   }

// //   const requests = await db.match.findMany({
// //     where: {
// //       matchId: session.user.id,
// //       status: "pending",
// //     },
// //     include: {
// //       sender: {
// //         include: {
// //           preferences: true,
// //         },
// //       },
// //     },
// //   });

// //   return NextResponse.json({ requests });
// // }

// // ✅ src/pages/api/match/request/route.ts
// import { auth } from "@/lib/actions";
// import { db } from "@/lib/db";
// import { NextResponse } from "next/server";
// import { startOfDay, endOfDay } from "date-fns";
// import { createNotification } from "@/lib/notifications";
// import { Server as SocketIOServer } from "socket.io";

// export async function POST(req: Request) {
//   const session = await auth();
//   if (!session?.user?.id) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   const userId = session.user.id;
//   const { matchId, message } = await req.json();

//   if (!matchId) {
//     return NextResponse.json({ error: "Match ID is required" }, { status: 400 });
//   }

//   const existing = await db.match.findFirst({ where: { userId, matchId } });
//   if (existing) {
//     return NextResponse.json({ error: "Request already sent" }, { status: 400 });
//   }

//   const user = await db.user.findUnique({
//     where: { id: userId },
//     select: { isPremium: true },
//   });

//   if (!user?.isPremium) {
//     const todayStart = startOfDay(new Date());
//     const todayEnd = endOfDay(new Date());
//     const requestsToday = await db.match.count({
//       where: {
//         userId,
//         createdAt: { gte: todayStart, lte: todayEnd },
//       },
//     });

//     if (requestsToday >= 3) {
//       return NextResponse.json({
//         error: "You've reached your daily request limit. Upgrade to premium to send more.",
//       }, { status: 403 });
//     }
//   }

//   const match = await db.match.create({
//     data: {
//       userId,
//       matchId,
//       message,
//       status: "pending",
//     },
//   });

//   if (message && message.trim().length > 0) {
//     try {
//       await db.message.create({
//         data: {
//           senderId: userId,
//           receiverId: matchId,
//           message,
//           timestamp: new Date(),
//         },
//       });
//     } catch (error) {
//       console.error("❌ Failed to save message:", error);
//     }
//   }

//   try {
//     const sender = await db.user.findUnique({ where: { id: userId } });
//     const receiver = await db.user.findUnique({ where: { id: matchId } });

//     if (sender && receiver) {
//       const notification = await createNotification({
//         type: "match-request",
//         message: `${sender.name} sent you a match request.`,
//         senderId: sender.id,
//         receiverId: receiver.id,
//       });

//       const globalAny = global as any;
//       const io = globalAny.io;

//       if (io) {
//         io.to(receiver.id).emit("new-notification", {
//           id: notification.id,
//           type: notification.type,
//           message: notification.message,
//           senderId: sender.id,
//           receiverId: receiver.id,
//           createdAt: notification.createdAt,
//           read: false,
//           sender: {
//             name: sender.name,
//             image: sender.image,
//           },
//         });

//         io.to(receiver.id).emit("refresh-requests");
//       }
//     }
//   } catch (error) {
//     console.error("❌ Failed to create notification:", error);
//   }

//   return NextResponse.json({ success: true, match });
// }

// export async function GET() {
//   const session = await auth();
//   if (!session?.user?.id) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   const requests = await db.match.findMany({
//     where: {
//       matchId: session.user.id,
//       status: "pending",
//     },
//     include: {
//       sender: {
//         include: { preferences: true },
//       },
//     },
//   });

//   return NextResponse.json({ requests });
// }

// ✅ Final FIXED version of: src/pages/api/match/request/route.ts
import { auth } from "@/lib/actions";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { startOfDay, endOfDay } from "date-fns";
import { createNotification } from "@/lib/notifications";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const senderId = session.user.id;
  const { matchId: receiverId, message } = await req.json();

  if (!receiverId) {
    return NextResponse.json({ error: "Match ID is required" }, { status: 400 });
  }

  // Already sent
  const existing = await db.match.findFirst({ where: { userId: senderId, matchId: receiverId } });
  if (existing) {
    return NextResponse.json({ error: "Request already sent" }, { status: 400 });
  }

  // Check premium status
  const user = await db.user.findUnique({ where: { id: senderId }, select: { isPremium: true } });
  if (!user?.isPremium) {
    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());
    const requestsToday = await db.match.count({
      where: {
        userId: senderId,
        createdAt: { gte: todayStart, lte: todayEnd },
      },
    });

    if (requestsToday >= 3) {
      return NextResponse.json({
        error: "You've reached your daily request limit. Upgrade to premium to send more.",
      }, { status: 403 });
    }
  }

  // Create match
  const match = await db.match.create({
    data: {
      userId: senderId,
      matchId: receiverId,
      message,
      status: "pending",
    },
  });

  // Optional message
  if (message?.trim()) {
    await db.message.create({
      data: { senderId, receiverId, message, timestamp: new Date() },
    });
  }

  const sender = await db.user.findUnique({ where: { id: senderId } });
  const receiver = await db.user.findUnique({ where: { id: receiverId } });

  if (sender && receiver) {
    const notification = await createNotification({
      type: "match-request",
      message: `${sender.name} sent you a match request.`,
      senderId,
      receiverId,
    });

    // Emit through Socket.IO (safe global broadcast)
    const globalAny = global as any;
    const io = globalAny.io;

    if (io) {
      io.to(receiverId).emit("new-notification", {
        id: notification.id,
        type: notification.type,
        message: notification.message,
        senderId,
        receiverId,
        createdAt: notification.createdAt,
        read: false,
        sender: {
          name: sender.name,
          image: sender.image,
        },
      });

      io.to(receiverId).emit("refresh-requests");
    } else {
      // fallback: emit manually from client socket
      try {
        const { sendMatchRequestSocket } = await import("@/lib/socket/sendMatchRequest");
        sendMatchRequestSocket({ senderId, receiverId, message });
      } catch (err) {
        console.error("❌ Failed to emit match-request from fallback:", err);
      }
    }
  }

  return NextResponse.json({ success: true, match });
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const requests = await db.match.findMany({
    where: {
      matchId: session.user.id,
      status: "pending",
    },
    include: {
      sender: { include: { preferences: true } },
    },
  });

  return NextResponse.json({ requests });
}
