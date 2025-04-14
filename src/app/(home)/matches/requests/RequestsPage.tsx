"use client"; // Marking this as a client-side component

import { useState, useEffect } from "react";
import Image from "next/image";

// Define the type for the request data
type Request = {
  id: string;
  sender: {
    name: string;
    bio: string;
    image: string;
  };
  message: string;
};

type RequestsPageProps = {
  requests: Request[];
};

export default function RequestsPage({ requests }: RequestsPageProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [requestsList, setRequestsList] = useState(requests); // State for the requests list
  const [messageFadeOut, setMessageFadeOut] = useState(false); // State to control fade-out of success message

  // Approve request
  const handleApprove = async (requestId: string) => {
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch("/api/match/approve", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          requestId: requestId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMessage("Request approved successfully!");

        // Trigger fade-out effect before removing the request
        setRequestsList((prevRequests) =>
          prevRequests.map((req) =>
            req.id === requestId ? { ...req, fadeOut: true } : req
          )
        );

        // Remove the request from the list after 4 seconds
        setTimeout(() => {
          setRequestsList((prevRequests) =>
            prevRequests.filter((req) => req.id !== requestId)
          );
        }, 4000); // Wait 4 seconds before removing from the DOM

        // Start fade-out for success message after 1 second
        setTimeout(() => {
          setMessageFadeOut(true);
        }, 1000); // Wait 1 second before starting the fade-out
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (error) {
      setError("Failed to approve the request.");
    } finally {
      setLoading(false);
    }
  };

  // Reject request
  const handleReject = async (requestId: string) => {
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch("/api/match/reject", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          requestId: requestId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMessage("Request rejected successfully!");

        // Trigger fade-out effect before removing the request
        setRequestsList((prevRequests) =>
          prevRequests.map((req) =>
            req.id === requestId ? { ...req, fadeOut: true } : req
          )
        );

        // Remove the request from the list after 4 seconds
        setTimeout(() => {
          setRequestsList((prevRequests) =>
            prevRequests.filter((req) => req.id !== requestId)
          );
        }, 4000); // Wait 4 seconds before removing from the DOM

        // Start fade-out for success message after 1 second
        setTimeout(() => {
          setMessageFadeOut(true);
        }, 1000); // Wait 1 second before starting the fade-out
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (error) {
      setError("Failed to reject the request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6">
      <h1 className="dark:text-white text-black text-2xl font-bold mb-2">Received Match Requests</h1>

      {/* Success Message with Fade-Out */}
      {successMessage && (
        <p
          className={`text-green-600 transition-opacity duration-1000 ${
            messageFadeOut ? "opacity-0" : "opacity-100"
          }`}
        >
          {successMessage}
        </p>
      )}

      {error && <p className="text-red-600">{error}</p>}

      {requestsList.length === 0 ? (
        <p className="text-gray-500">No pending requests right now.</p>
      ) : (
        <div className="space-y-6">
          {requestsList.map((req) => (
            <div
              key={req.id}
              className={`rounded-2xl p-4 bg-white dark:bg-dark-2 shadow flex items-start gap-4 transition-opacity duration-1000 ${
                req.fadeOut ? "opacity-0" : "opacity-100"
              }`} // Apply fade-out class when fadeOut is true
            >
              <Image
                src={req.sender.image || "/images/user/default.png"}
                alt={req.sender.name}
                width={60}
                height={60}
                className="rounded-full object-cover"
              />
              <div className="flex-1">
                <h2 className="font-semibold text-gray-800 dark:text-gray-1 text-lg">{req.sender.name}</h2>
                <p className="text-sm text-gray-800 dark:text-gray-5 italic mb-2">{req.sender.bio}</p>
                <p className="text-gray-800 dark:text-gray-4 mb-3">
                  <strong>Message:</strong> {req.message}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleApprove(req.id)}
                    disabled={loading}
                    className="bg-[#A8D86D] text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    {loading ? "Approving..." : "Approve"}
                  </button>

                  <button
                    onClick={() => handleReject(req.id)}
                    disabled={loading}
                    className="bg-[#D25C5C] text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    {loading ? "Rejecting..." : "Remove"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
