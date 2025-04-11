"use client";

import React from "react";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function PremiumLimitModal({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
        <h2 className="text-xl font-bold text-red-600 mb-2">Daily Limit Reached</h2>
        <p className="text-gray-700 text-sm mb-4">
          You’ve sent 3 match requests today. Upgrade to Premium for unlimited access to potential matches.
        </p>

        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 bg-gray-200 text-sm rounded hover:bg-gray-300"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-black text-white text-sm rounded hover:bg-gray-900"
            onClick={() => window.location.href = "/premium"}
          >
            Upgrade to Premium
          </button>
        </div>
      </div>
    </div>
  );
}
