"use client";

import { useState } from "react";

export default function DeleteUserForm({ userId }: { userId: string }) {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!confirm("Are you sure you want to delete this user?")) {
      e.preventDefault();
    } else {
      setSubmitting(true);
    }
  };

  return (
    <form
      action="/api/admin/users/delete"
      method="POST"
      onSubmit={handleSubmit}
      className="inline"
    >
      <input type="hidden" name="userId" value={userId} />
      <button
        type="submit"
        disabled={submitting}
        className="text-red-600 hover:underline text-xs"
      >
        Delete
      </button>
    </form>
  );
}
