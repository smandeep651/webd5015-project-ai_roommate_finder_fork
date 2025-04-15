"use client";

import React from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onUpgradeClick: () => void;
};

export default function PremiumLimitModal({ open, onClose, onUpgradeClick }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-dark-2 rounded-xl shadow-lg max-w-md w-full p-6">
        <h2 className="text-xl font-bold text-red-600 mb-2">Daily Limit Reached</h2>
        <p className="text-white text-sm mb-4">
          You’ve sent 3 match requests today. Upgrade to Premium for unlimited access to potential matches.
        </p>

        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 bg-dark-4 text-sm rounded hover:bg-dark-3"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-primary text-white text-sm rounded hover:bg-primaryhover"
            onClick={onUpgradeClick}
          >
            Upgrade to Premium
          </button>
        </div>
      </div>
    </div>
  );
}
