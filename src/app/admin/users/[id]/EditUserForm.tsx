"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function EditUserForm({
  user,
}: {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    isPremium: boolean;
  };
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);

    const res = await fetch("/api/admin/users/update", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      router.push("/admin/users");
    } else {
      alert("Failed to update user");
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="hidden" name="id" value={user.id} />

      <div>
        <label className="block text-sm font-medium">Name</label>
        <input
          name="name"
          defaultValue={user.name}
          required
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Email</label>
        <input
          name="email"
          type="email"
          defaultValue={user.email}
          required
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Role</label>
        <select
          name="role"
          defaultValue={user.role}
          className="w-full border p-2 rounded"
        >
          <option value="User">User</option>
          <option value="Admin">Admin</option>
        </select>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="isPremium"
          id="isPremium"
          defaultChecked={user.isPremium}
        />
        <label htmlFor="isPremium" className="text-sm">
          Premium User
        </label>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {submitting ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
