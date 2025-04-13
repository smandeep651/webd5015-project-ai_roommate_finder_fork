"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateUserForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    const res = await fetch("/api/admin/users/create", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      router.push("/admin/users");
    } else {
      const message = await res.text();
      setError(message);
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto">
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div>
        <label className="block text-sm font-medium">Name</label>
        <input name="name" required className="w-full border p-2 rounded" />
      </div>

      <div>
        <label className="block text-sm font-medium">Email</label>
        <input type="email" name="email" required className="w-full border p-2 rounded" />
      </div>

      <div>
        <label className="block text-sm font-medium">Password</label>
        <input type="password" name="password" required className="w-full border p-2 rounded" />
      </div>

      <div>
        <label className="block text-sm font-medium">Role</label>
        <select name="role" required className="w-full border p-2 rounded">
          <option value="User">User</option>
          <option value="Admin">Admin</option>
        </select>
      </div>

      <div className="flex items-center space-x-2">
        <input type="checkbox" name="isPremium" id="isPremium" />
        <label htmlFor="isPremium" className="text-sm">Premium User</label>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {submitting ? "Creating..." : "Create User"}
      </button>
    </form>
  );
}
