"use client";

import Image from "next/image";
import { useState } from "react";
import ConfirmModal from "./ConfirmModal";
import PremiumLimitModal from "./PremiumLimitModal"; 

type MatchCardProps = {
  match: any;
  onSubmit: (id: string, message: string) => Promise<void>;
  userId: string; // ✅ MUST be passed when you use <MatchCard />
};

export default function MatchCard({ match, onSubmit, userId }: MatchCardProps) {
  const [showInput, setShowInput] = useState(false);
  const [message, setMessage] = useState("");
  const [requestSent, setRequestSent] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false); 
  const [isRemoving, setIsRemoving] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [showPremiumModal, setShowPremiumModal] = useState(false); 

  const handleSend = async () => {
    try {
      const response = await fetch("/api/match/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          matchId: match.id,
          message,
        }),
      });
      
      if (response.status === 403) {
        setShowPremiumModal(true); // ✅ show popup
        return;
      }

      if (!response.ok) {
        console.error("❌ Failed to send match request");
        return;
      }
      setRequestSent(true);
      setShowInput(false);
  
  
      // Remove from DOM after fade
      setTimeout(() => {
        setIsRemoving(true); // Start fade-out
  
        // ⏳ After fade-out duration, remove from DOM
        setTimeout(() => {
          setIsVisible(false);
        }, 500); // matches fade-out animation time
      }, 1000); // Wait 2 seconds before starting fade-out
    } catch (err) {
      console.error("Failed to send match request:", err);
    }
  };
  
  const handleRemove = async () => {
    try {
      console.log("Sending remove request with:", {
        userId,
        matchId: match.id,
      });

      const response = await fetch("/api/match/remove", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, matchId: match.id }),
      });

      if (response.ok) {
        setShowConfirm(false); // Close the modal
        setIsRemoving(true);   // Trigger fade-out

        setTimeout(() => {
          setIsVisible(false); // Remove from UI
        }, 500); // Wait for fade-out to finish
      } else {
        console.error("Failed to remove match");
      }
    } catch (error) {
      console.error("Error removing match:", error);
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className={`w-full bg-white dark:bg-dark-2 dark:shadow-card text-white rounded-2xl shadow-lg flex gap-4 mb-5 hover:shadow-lg transition-opacity duration-500 relative ${
        isRemoving ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleRemove}
      />

         {/* ✅ Premium popup */}
         <PremiumLimitModal
        open={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
      />

      {/* Match Details */}
      <div className="flex">
        {/* Profile Image */}
        <div className="flex-shrink-0">
          <Image
            src={match.image || match.imageUrl || "/images/user/default.png"}
            alt={match.name}
            width={170}
            height={150}
            className="rounded-s-xl object-cover bg-gray-2 h-full border-r-4 border-primary"
          />
        </div>

        {/* Roommate Details */}
        <div className="flex-1 p-6">
          <h2 className="text-[22px] text-black dark:text-white font-semibold pb-1">{match.name}</h2>
          <p className="text-gray-400 text-sm flex flex-wrap gap-2">
            {match.preferences?.country && <span>From {match.preferences.country} •</span>}
            {match.preferences?.age && <span>{match.preferences.age} years •</span>}
            {match.preferences?.genderPreference && <span>{match.preferences.genderPreference} •</span>}
            {match.preferences?.occupation && <span>{match.preferences.occupation} •</span>}
            {match.preferences?.maxBudget && <span>Max Budget: ${match.preferences.maxBudget}</span>}
          </p>

          {/* Bio */}
          {match.bio && (
            <p className="mt-2 text-gray-300 text-base leading-relaxed">
              {match.bio} <span className="text-blue-400 cursor-pointer">more</span>
            </p>
          )}

          {/* Location */}
          {match.preferences?.preferredLocation && (
            <p className="mt-2 text-gray-400 text-sm pb-3">
              <span className="font-semibold">Roommate Looking:</span>{" "}
              {match.preferences.preferredLocation}
            </p>
          )}
          {/* Match Request / Remove Buttons */}
          {requestSent ? (
            <button disabled className="bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed">
              Request Sent
            </button>
          ) : showInput ? (
            <div className="space-y-2">
              <textarea
                rows={2}
                placeholder="Write a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full border p-2 rounded"
              />
              <div className="flex gap-3">
                <button onClick={handleSend} className="bg-primary text-white px-4 py-2 rounded hover:bg-primary">
                  Send Match Request
                </button>
                <button onClick={() => setShowInput(false)} className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-3">
              <button onClick={() => setShowInput(true)} className="bg-primary text-white px-4 py-2 rounded hover:bg-grey">
                Send Match Request
              </button>
              <button
                onClick={() => setShowConfirm(true)}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Remove
              </button>
            </div>
          )}
        </div>
        </div>
      </div>

  );
}
