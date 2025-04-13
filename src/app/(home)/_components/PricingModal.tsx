"use client";

import React from "react";

type Props = {
  open: boolean;
  onClose: () => void;
};

const subscribe = async (priceId: string) => {
  const res = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ priceId }),
  });

  const data = await res.json();
  window.location.href = data.url;
};

export default function PricingModal({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
        <h1 className="text-2xl font-bold mb-4">Choose Your Plan</h1>
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Monthly Plan</h2>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded mt-2 hover:bg-blue-700"
              onClick={() => subscribe("price_1RD4iMRxTMGXma4mLdbthgnE")}
            >
              Subscribe Monthly
            </button>
          </div>
          <div>
            <h2 className="text-xl font-semibold">Yearly Plan</h2>
            <button
              className="px-4 py-2 bg-green-600 text-white rounded mt-2 hover:bg-green-700"
              onClick={() => subscribe("price_1RD4iMRxTMGXma4mSxzivPUr")}
            >
              Subscribe Yearly
            </button>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            className="px-4 py-2 text-sm rounded bg-gray-200 hover:bg-gray-300"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}