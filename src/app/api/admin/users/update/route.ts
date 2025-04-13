// src/app/api/admin/users/update/route.ts

import { db } from "@/lib/db";

export async function POST(req: Request) {
  const formData = await req.formData();

  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const role = formData.get("role") as "User" | "Admin";
  const isPremium = formData.get("isPremium") === "on";

  if (!id || !name || !email || !role) {
    return new Response("Missing required fields", { status: 400 });
  }

  try {
    await db.user.update({
      where: { id },
      data: {
        name,
        email,
        role,
        isPremium,
      },
    });

    return new Response(null, {
      status: 302,
      headers: {
        Location: "/admin/users",
      },
    });
  } catch (error) {
    console.error("Update user failed:", error);
    return new Response("Failed to update user", { status: 500 });
  }
}
