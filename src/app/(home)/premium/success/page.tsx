"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const [session, setSession] = useState(null);

  useEffect(() => {
    const sessionId = searchParams?.get("session_id");

    if (sessionId) {
      fetch(`/api/checkout-session?session_id=${sessionId}`)
        .then((res) => res.json())
        .then((data) => setSession(data));
    }
  }, [searchParams]);

  if (!session) return <p>Loading payment details...</p>;

  return (
    <div>
      <h2>Payment Successful!</h2>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
}
