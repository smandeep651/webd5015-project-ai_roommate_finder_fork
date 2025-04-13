import CreateUserForm from "./CreateUserForm";
import { auth } from "@/lib/actions";
import { redirect } from "next/navigation";

export default async function NewUserPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "Admin") {
    redirect("/");
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold max-w-xl mb-4 mx-auto">Create New User</h1>
      <CreateUserForm />
    </main>
  );
}
