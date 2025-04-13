// "use client";

// import Image from "next/image";
// import { useState } from "react";
// import ConfirmModal from "./ConfirmModal";
// import PremiumLimitModal from "./PremiumLimitModal"; 

// type MatchCardProps = {
//   match: any;
//   onSubmit: (id: string, message: string) => Promise<void>;
//   userId: string; // ✅ MUST be passed when you use <MatchCard />
// };

// export default function MatchCard({ match, onSubmit, userId }: MatchCardProps) {
//   const [showInput, setShowInput] = useState(false);
//   const [message, setMessage] = useState("");
//   const [requestSent, setRequestSent] = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false); 
//   const [isRemoving, setIsRemoving] = useState(false);
//   const [isVisible, setIsVisible] = useState(true);
//   const [showPremiumModal, setShowPremiumModal] = useState(false); 

//   const handleSend = async () => {
//     try {
//       const response = await fetch("/api/match/request", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           matchId: match.id,
//           message,
//         }),
//       });
      
//       if (response.status === 403) {
//         setShowPremiumModal(true); // ✅ show popup
//         return;
//       }

//       if (!response.ok) {
//         console.error("❌ Failed to send match request");
//         return;
//       }
//       setRequestSent(true);
//       setShowInput(false);
  
  
//       // Remove from DOM after fade
//       setTimeout(() => {
//         setIsRemoving(true); // Start fade-out
  
//         // ⏳ After fade-out duration, remove from DOM
//         setTimeout(() => {
//           setIsVisible(false);
//         }, 500); // matches fade-out animation time
//       }, 1000); // Wait 2 seconds before starting fade-out
//     } catch (err) {
//       console.error("Failed to send match request:", err);
//     }
//   };
  
//   const handleRemove = async () => {
//     try {
//       console.log("Sending remove request with:", {
//         userId,
//         matchId: match.id,
//       });

//       const response = await fetch("/api/match/remove", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ userId, matchId: match.id }),
//       });

//       if (response.ok) {
//         setShowConfirm(false); // Close the modal
//         setIsRemoving(true);   // Trigger fade-out

//         setTimeout(() => {
//           setIsVisible(false); // Remove from UI
//         }, 500); // Wait for fade-out to finish
//       } else {
//         console.error("Failed to remove match");
//       }
//     } catch (error) {
//       console.error("Error removing match:", error);
//     }
//   };

//   if (!isVisible) return null;

//   return (
//     <div
//       className={`w-full bg-white rounded-xl shadow-md border p-6 hover:shadow-lg transition-opacity duration-500 relative ${
//         isRemoving ? "opacity-0 pointer-events-none" : "opacity-100"
//       }`}
//     >
//       {/* Confirm Modal */}
//       <ConfirmModal
//         isOpen={showConfirm}
//         onClose={() => setShowConfirm(false)}
//         onConfirm={handleRemove}
//       />

//          {/* ✅ Premium popup */}
//          <PremiumLimitModal
//         open={showPremiumModal}
//         onClose={() => setShowPremiumModal(false)}
//       />

//       {/* Match Details */}
//       <div className="flex items-center gap-6 mb-4">
//         <Image
//           src={match.image || "/images/user/default.png"}
//           alt={match.name}
//           width={80}
//           height={80}
//           className="rounded-full object-cover"
//         />
//         <div>
//           <h2 className="font-semibold text-xl">{match.name}</h2>
//           <p className="text-sm text-gray-500">{match.preferences?.occupation}</p>
//           <p className="text-sm text-gray-600 italic">{match.bio}</p>
//         </div>
//       </div>

//       <div className="text-sm text-gray-700 space-y-1 pl-1 mb-4">
//         <p><strong>Preferred Location:</strong> {match.preferences?.preferredLocation}</p>
//         <p><strong>Age Range:</strong> {match.preferences?.minAge} - {match.preferences?.maxAge}</p>
//         <p><strong>Budget:</strong> ${match.preferences?.minBudget} - ${match.preferences?.maxBudget}</p>
//         <p><strong>Accommodation Type:</strong> {match.preferences?.accommodationType}</p>
//         <p><strong>Habits:</strong> {match.preferences?.sleepPattern} | Drinking: {match.preferences?.drinking ? "Yes" : "No"} | Smoking: {match.preferences?.smoking ? "Yes" : "No"}</p>
//         <p><strong>Cooking:</strong> {match.preferences?.cooking}</p>
//         <p><strong>Pets:</strong> {match.preferences?.hasPets ? `Yes (${match.preferences?.petType || "N/A"})` : "No"}</p>
//         <p><strong>Gender Preference:</strong> {match.preferences?.genderPreference}</p>
//         <p><strong>Ethnicity:</strong> {match.preferences?.ethnicity}</p>
//         <p><strong>Religion:</strong> {match.preferences?.religion}</p>
//       </div>

//       {/* Match Request / Remove Buttons */}
//       {requestSent ? (
//         <button disabled className="bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed">
//           Request Sent
//         </button>
//       ) : showInput ? (
//         <div className="space-y-2">
//           <textarea
//             rows={2}
//             placeholder="Write a message..."
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             className="w-full border p-2 rounded"
//           />
//           <div className="flex gap-3">
//             <button onClick={handleSend} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
//               Send Match Request
//             </button>
//             <button onClick={() => setShowInput(false)} className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400">
//               Cancel
//             </button>
//           </div>
//         </div>
//       ) : (
//         <div className="flex gap-3">
//           <button onClick={() => setShowInput(true)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
//             Send Match Request
//           </button>
//           <button
//             onClick={() => setShowConfirm(true)}
//             className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
//           >
//             Remove
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import Image from "next/image";
import { useState } from "react";
import ConfirmModal from "./ConfirmModal";
import PremiumLimitModal from "./PremiumLimitModal";
import PricingModal from "./PricingModal"; // ✅ Added

type MatchCardProps = {
  match: any;
  onSubmit: (id: string, message: string) => Promise<void>;
  userId: string;
};

export default function MatchCard({ match, onSubmit, userId }: MatchCardProps) {
  const [showInput, setShowInput] = useState(false);
  const [message, setMessage] = useState("");
  const [requestSent, setRequestSent] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false); // ✅ Added

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
        setShowPremiumModal(true); // ✅ Show Premium modal if limit hit
        return;
      }

      if (!response.ok) {
        console.error("❌ Failed to send match request");
        return;
      }

      setRequestSent(true);
      setShowInput(false);

      setTimeout(() => {
        setIsRemoving(true);
        setTimeout(() => {
          setIsVisible(false);
        }, 500);
      }, 1000);
    } catch (err) {
      console.error("Failed to send match request:", err);
    }
  };

  const handleRemove = async () => {
    try {
      const response = await fetch("/api/match/remove", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, matchId: match.id }),
      });

      if (response.ok) {
        setShowConfirm(false);
        setIsRemoving(true);

        setTimeout(() => {
          setIsVisible(false);
        }, 500);
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
      className={`w-full bg-white rounded-xl shadow-md border p-6 hover:shadow-lg transition-opacity duration-500 relative ${
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
        onUpgradeClick={() => {
          setShowPremiumModal(false);
          setShowPricingModal(true); // ✅ Open pricing modal
        }}
      />

      {/* ✅ Pricing modal */}
      <PricingModal
        open={showPricingModal}
        onClose={() => setShowPricingModal(false)}
      />

      {/* Match Details */}
      <div className="flex items-center gap-6 mb-4">
        <Image
          src={match.image || "/images/user/default.png"}
          alt={match.name}
          width={80}
          height={80}
          className="rounded-full object-cover"
        />
        <div>
          <h2 className="font-semibold text-xl">{match.name}</h2>
          <p className="text-sm text-gray-500">{match.preferences?.occupation}</p>
          <p className="text-sm text-gray-600 italic">{match.bio}</p>
        </div>
      </div>

      <div className="text-sm text-gray-700 space-y-1 pl-1 mb-4">
        <p><strong>Preferred Location:</strong> {match.preferences?.preferredLocation}</p>
        <p><strong>Age Range:</strong> {match.preferences?.minAge} - {match.preferences?.maxAge}</p>
        <p><strong>Budget:</strong> ${match.preferences?.minBudget} - ${match.preferences?.maxBudget}</p>
        <p><strong>Accommodation Type:</strong> {match.preferences?.accommodationType}</p>
        <p><strong>Habits:</strong> {match.preferences?.sleepPattern} | Drinking: {match.preferences?.drinking ? "Yes" : "No"} | Smoking: {match.preferences?.smoking ? "Yes" : "No"}</p>
        <p><strong>Cooking:</strong> {match.preferences?.cooking}</p>
        <p><strong>Pets:</strong> {match.preferences?.hasPets ? `Yes (${match.preferences?.petType || "N/A"})` : "No"}</p>
        <p><strong>Gender Preference:</strong> {match.preferences?.genderPreference}</p>
        <p><strong>Ethnicity:</strong> {match.preferences?.ethnicity}</p>
        <p><strong>Religion:</strong> {match.preferences?.religion}</p>
      </div>

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
            <button onClick={handleSend} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Send Match Request
            </button>
            <button onClick={() => setShowInput(false)} className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex gap-3">
          <button onClick={() => setShowInput(true)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
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
  );
}
