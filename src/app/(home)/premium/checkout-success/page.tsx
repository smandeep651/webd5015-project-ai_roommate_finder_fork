'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function CheckoutSuccess() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [session, setSession] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      if (!sessionId) return;

      const res = await fetch(`/api/checkout-session?session_id=${sessionId}`);
      const data = await res.json();
      setSession(data);
    };

    fetchSession();
  }, [sessionId]);

  if (!sessionId) return <p>Missing session ID</p>;
  if (!session) return <p>Loading session details...</p>;

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold text-green-600 mb-4">✅ Payment Successful</h1>
      <p className="mb-2">Thanks for subscribing, {session.customer_details?.name}!</p>
      <p className="mb-4">Email: {session.customer_details?.email}</p>
      <p className="mb-6">Subscription ID: {session.subscription}</p>

      <button
        onClick={() => router.push('/home')}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Go back to Home
      </button>
    </div>
  );
}
