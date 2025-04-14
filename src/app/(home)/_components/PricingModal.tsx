"use client";

import Image from "next/image";
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
    <div className="fixed inset-0 z-[999999] flex items-center justify-center text-white bg-black bg-opacity-40">
      <div className="bg-dark-2 rounded-xl shadow-lg max-w-max w-full p-6 py-10">
        <h1 className="text-2xl text-center font-bold mb-6">Choose Your Plan</h1>
        <div className="flex gap-6">
          <div className="bg-dark-3 p-4 rounded-lg flex flex-col gap-2">
          <h2 className="text-4xl font-semibold mt-2">CA$4.99</h2>
            <h2 className="text-xl font-semibold">Monthly Plan</h2>
            <h2 className="text-md font-normal">get 30 matches requests</h2>
            <button
              className="w-[200px] mt-5 px-4 py-2 bg-primary text-white rounded mt-2 hover:bg-primaryhover"
              onClick={() => subscribe("price_1RD4iMRxTMGXma4mLdbthgnE")}
            >
              Subscribe Monthly
            </button>
          </div>
          <div className="bg-dark-3 p-4 rounded-lg flex flex-col gap-2">
          <h2 className="text-4xl font-semibold mt-2">CA$49.99</h2>
            <h2 className="text-xl font-semibold">Yearly Plan</h2>
            <h2 className="text-md font-normal">get unlimited matches requests</h2>
            <button
              className="w-[220px] mt-5 px-4 py-2 bg-green-600 text-white rounded mt-2 hover:bg-green-700"
              onClick={() => subscribe("price_1RD4iMRxTMGXma4mSxzivPUr")}
            >
              Subscribe Yearly
            </button>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            className="px-4 py-2 bg-dark-4 text-sm rounded hover:bg-dark-3"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}