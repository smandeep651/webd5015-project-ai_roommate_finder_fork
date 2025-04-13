import { db } from "@/lib/db";
import { auth } from "@/lib/actions";
import { redirect } from "next/navigation";
import EditUserForm from "./EditUserForm";
import Link from "next/link";


export default async function EditUserPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "Admin") {
    redirect("/");
  }

  const user = await db.user.findUnique({
    where: { id: params.id },
  });

  if (!user) {
    return <div className="p-6 text-red-500">User not found.</div>;
  }

  return (
    <main className="p-6 max-w-xl mx-auto">
        <Link
        href="/admin/users"
        className="inline-block mb-4 text-blue-600 hover:underline text-sm"
      >
        ← Back to User Management
      </Link>
      <h1 className="text-2xl font-bold mb-6">Edit User</h1>
      <EditUserForm user={user} />
    </main>
  );
}
