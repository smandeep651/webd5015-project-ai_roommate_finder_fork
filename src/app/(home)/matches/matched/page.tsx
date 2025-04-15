
export const dynamic = "force-dynamic";

import { auth } from "@/lib/actions";
import { fetchMatchedChats } from "@/lib/fetchMatchedChats";
import MatchedClient from "./MatchedClient";
import MatchedRefresh from "../../_components/MatchedRefresh";

export default async function MatchedPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const formattedMatches = await fetchMatchedChats(session.user.id);

  return (
    <>
      <MatchedRefresh />
      <main className="p-6">
        <h1 className="dark:text-white text-black text-2xl font-bold mb-4">Matched Users</h1>
        <MatchedClient initialMatches={formattedMatches} currentUserId={session.user.id} />
      </main>
    </>
  );
}
