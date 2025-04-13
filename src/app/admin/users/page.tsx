import { db } from "@/lib/db";
import { auth } from "@/lib/actions";
import { redirect } from "next/navigation";
import Link from "next/link";
import DeleteUserForm from "../_components/DeleteUserForm";

export default async function AdminUsersPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "Admin") {
    redirect("/");
  }

  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isPremium: true,
    },
  });

  return (
    <main className="p-6">
       <Link
        href="/admin"
        className="inline-block mb-4 text-blue-600 hover:underline text-sm"
      >
        ← Back to Dashboard
      </Link>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Link
          href="/admin/users/new"
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
        >
          + Create User
        </Link>
      </div>

      <table className="w-full border text-sm rounded overflow-hidden">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Role</th>
            <th className="p-3">Premium</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t">
              <td className="p-3">{user.name}</td>
              <td className="p-3">{user.email}</td>
              <td className="p-3">{user.role}</td>
              <td className="p-3">{user.isPremium ? "✅" : "❌"}</td>
              <td className="p-3 space-x-2">
                <Link
                  href={`/admin/users/${user.id}`}
                  className="text-blue-600 hover:underline text-xs"
                >
                  Edit
                </Link>

                {user.role !== "Admin" && (
                  <DeleteUserForm userId={user.id} />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
