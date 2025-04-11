// src/app/(home)/matches/requests/page.tsx (Server Component)

import { auth } from "@/lib/actions";
import { db } from "@/lib/db";
import RequestsPage from "./RequestsPage"; // Import the client-side component

export default async function RequestsPageServer() {
  const session = await auth();
  if (!session?.user?.id) {
    // Redirect if no user session
    return redirect("/auth/sign-in");
  }

  // Fetch the requests from the database
  const requests = await db.match.findMany({
    where: {
      matchId: session.user.id,
      status: "pending",
    },
    include: {
      sender: true,
    },
  });

  // Pass the fetched requests as props to the client-side component
  return <RequestsPage requests={requests} />;
}
