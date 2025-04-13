import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const userId = formData.get("userId") as string;

    if (!userId) {
      return new Response("Missing userId", { status: 400 });
    }

    await db.user.delete({
      where: { id: userId },
    });

    return new Response(null, {
      status: 302,
      headers: {
        Location: "/admin/users",
      },
    });
  } catch (error) {
    console.error("❌ DELETE USER ERROR:", error);
    return new Response("Failed to delete user", { status: 500 });
  }
}
