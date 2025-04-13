import { db } from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const role = formData.get("role") as "User" | "Admin";
    const isPremium = formData.get("isPremium") === "on";

    if (!name || !email || !password || !role) {
      return new Response("Missing required fields", { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const isStrongPassword = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{7,}$/.test(password);

    if (!isStrongPassword) {
        return new Response(
            "Password must be at least 7 characters and include an uppercase letter, a number, and a special character.",
            { status: 400 }
        );
        }


    await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
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
    console.error("❌ CREATE USER ERROR:", error);
    return new Response("Failed to create user", { status: 500 });
  }
}
